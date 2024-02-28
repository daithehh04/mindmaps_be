const { BadRequestError, AuthFailureError } = require("../core/error.response")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const { v4: uuidv4 } = require("uuid")
const sendMail = require("../utils/mail")

const { User, keyToken, blacklistToken } = require("../models/index")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { ServerResponse } = require("http")
const KeyTokenService = require("./keyToken.service")
const { getUserById, getProfileUser } = require("./user.service")
const UserTransformer = require("../transformers/user.transformer")
const passport = require("passport")
class AuthService {
  static handleLoginWithGoogle = async (req) => {
    const emptyResponse = new ServerResponse(req)
    passport.authenticate(
      "google",
      {
        scope: ["email", "profile"],
      },
      (err, user, info) => {
        console.log(err, user, info)
      }
    )(req, emptyResponse)

    const url = emptyResponse.getHeader("location")

    return url
  }
  static handleLoginWithGoogleCallback = async (req) => {
    const data = req.user
    if (!data) throw new BadRequestError("Not found user!")
    let user = await User.findOne({
      where: { email: data.email, provider: "google" },
    })
    if (!user) {
      const newUser = await User.create({
        id: crypto.randomBytes(4).toString("hex"),
        email: data.email,
        name: data.name,
        picture: data.picture,
        provider: "google",
      })
      user = newUser
    }
    const privateKey = crypto.randomBytes(64).toString("hex")
    const publicKey = crypto.randomBytes(64).toString("hex")
    const { id: userId, email } = user
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    )
    await KeyTokenService.createOrUpdateKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
    })
    return {
      user: new UserTransformer(user),
      tokens,
    }
  }
  static handlerRefreshToken = async ({ refreshToken, userId }) => {
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (keyStore.refresh_token !== refreshToken)
      throw new AuthFailureError("Account not register 1!")
    const foundUser = await getUserById(userId)
    if (!foundUser) throw new AuthFailureError("Account not register 2!")
    // create 1 cặp mới
    const tokens = await createTokenPair(
      { userId, email: foundUser.email },
      keyStore.public_key,
      keyStore.private_key
    )
    await keyToken.update(
      {
        refresh_token: tokens.refreshToken,
      },
      {
        where: {
          user_id: userId,
        },
      }
    )
    return {
      tokens,
      userId,
    }
  }

  static getUserFromToken = async ({ userId, accessToken }) => {
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError("Not found keystore")
    const decodeUser = await verifyJWT(accessToken, keyStore.public_key)
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid userId")
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    })
    return new UserTransformer(user)
  }
  static login = async ({ email, password }) => {
    const user = await User.findOne({
      where: { email, provider: null },
    })
    if (!user) throw new BadRequestError("Not found user!")

    const match = await bcrypt.compare(password, user.password)

    if (!match) throw new AuthFailureError("Authentication Error")

    const privateKey = crypto.randomBytes(64).toString("hex")
    const publicKey = crypto.randomBytes(64).toString("hex")

    const { id: userId } = user
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    )
    await KeyTokenService.createOrUpdateKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
    })
    return {
      user: new UserTransformer(user),
      tokens,
    }
  }

  static signUp = async ({ name, email, password }) => {
    // check email exists?
    const user = await User.findOne({ where: { email, provider: null } })
    if (user) {
      throw new BadRequestError("Error: Account already registered!")
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      id: crypto.randomBytes(4).toString("hex"),
      name,
      email,
      password: passwordHash,
    })
    if (newUser) {
      // create privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString("hex")
      const publicKey = crypto.randomBytes(64).toString("hex")
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser.id,
        publicKey,
        privateKey,
      })
      if (!keyStore) {
        throw new BadRequestError("Error: KeyStore error!")
      }
      // created token pair
      const tokens = await createTokenPair(
        { userId: newUser.id, email },
        publicKey,
        privateKey
      )
      return {
        user: new UserTransformer(newUser),
        tokens,
      }
    }
    return null
  }

  static logout = async ({ accessToken, userId }) => {
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError("Not found keystore")
    const decodeUser = await verifyJWT(accessToken, keyStore.public_key)
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid userId")
    const { exp } = decodeUser
    const delKey = await KeyTokenService.removeKeyById(keyStore.user_id)
    await blacklistToken.findOrCreate({
      where: { token: accessToken },
      defaults: {
        token: accessToken,
        expired: new Date(exp * 1000),
      },
    })
    return delKey
  }

  static handleForgotPassword = async ({ email }) => {
    const user = await User.findOne({ where: { email, provider: null } })
    if (!user) throw new BadRequestError("Not found User!")
    const idReset = uuidv4()
    const currentTime = new Date()
    await User.update(
      {
        id_reset: idReset,
        expired_at: new Date(currentTime.getTime() + 15 * 60 * 1000),
      },
      {
        where: {
          email,
          provider: null,
        },
      }
    )
    const resetLink = `http://localhost:5173/account/reset-password/${idReset}`
    const info = await sendMail(email, "Email confirm!", resetLink)
    return info
  }

  static handleResetPassword = async ({ password, idReset }) => {
    const hashPassword = bcrypt.hashSync(password, 10)
    await User.update(
      {
        password: hashPassword,
      },
      { where: { id_reset: idReset } }
    )
    const user = await User.findOne({
      where: { id_reset: idReset },
      attributes: { exclude: ["password"] },
    })
    return new UserTransformer(user)
  }

  static handleChangePassword = async ({ password, idUser }) => {
    const foundUser = await User.findByPk(idUser)
    if (!foundUser) throw new BadRequestError("Not found User!")
    const hashPassword = bcrypt.hashSync(password, 10)
    await foundUser.update({
      password: hashPassword,
    })
    const user = await User.findByPk(idUser, {
      attributes: { exclude: ["password"] },
    })
    return new UserTransformer(user)
  }

  static checkUserFromIdReset = async ({ idReset }) => {
    const user = await User.findOne({
      where: { id_reset: idReset },
    })
    if (!user) throw new BadRequestError("Not found User!")
    const timeExpired = user.expired_at - new Date()
    if (timeExpired < 0) throw new BadRequestError("IdReset expired!")
    return new UserTransformer(user)
  }
}

module.exports = AuthService
