"use strict"

const JWT = require("jsonwebtoken")
const asyncHandler = require("../helpers/asyncHandler")
const { AuthFailureError, NotFoundError } = require("../core/error.response")
const { findByUserId } = require("../services/keyToken.service")
const { findTokenInBlacklist } = require("../services/blacklistToken.service")

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "1 days",
    })
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    })
    //
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err)
      } else {
        console.log(`decode verify::`, decode)
      }
    })
    return { accessToken, refreshToken }
  } catch (error) {}
}

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError("Invalid request 1")

  const keyStore = await findByUserId(userId)
  if (!keyStore) throw new NotFoundError("Not found keystore")

  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError("Invalid request 2")

  const existToken = await findTokenInBlacklist(accessToken)
  if (existToken) throw new AuthFailureError("Invalid request 3")

  try {
    JWT.verify(accessToken, keyStore.public_key, (err, decodeUser) => {
      if (err) {
        throw new AuthFailureError("Invalid userId")
      } else {
        if (userId !== decodeUser.userId)
          throw new AuthFailureError("Invalid userId")
        req.user = { ...decodeUser, accessToken }
        req.keyStore = keyStore
        req.userId = userId
        return next()
      }
    })
  } catch (error) {
    throw error
  }
})

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
}
