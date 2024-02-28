const { NotFoundError } = require("../core/error.response")
const { User } = require("../models/index")
const { cloudinary } = require("../utils/cloudinary")
class UserService {
  static async getProfileUser({ email, provider }) {
    const user = await User.findOne({
      where: { email, provider },
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      throw new NotFoundError("User không tồn tại!")
    }
    return user
  }
  static async getAllUser({ page, limit }) {
    const options = {
      order: [["id", "desc"]],
      attributes: { exclude: ["password"] },
    }
    if (!+page || page < 0) {
      page = 1
    }
    if (limit && Number.isInteger(+limit)) {
      options.limit = limit
      const offset = (page - 1) * limit
      options.offset = offset
    }
    const { rows: users, count } = await User.findAndCountAll(options)
    return {
      users,
      count,
    }
  }

  static async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    })
    if (!user) {
      throw new NotFoundError("User không tồn tại!")
    }
    return user
  }

  static async updateUserById({ id, name }) {
    await User.update({ fullname: name }, { where: { id } })
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    })
    return user
  }

  static async deleteUserById({ id }) {
    const user = await User.destroy({ where: { id } })
    return user
  }

  static async deleteUsers({ ids }) {
    const user = await User.destroy({
      where: {
        id: ids,
      },
    })
    return user
  }

  static async getUserByEmail({ email }) {
    const user = await User.findOne({ where: { email, provider: null } })
    if (!user) {
      throw new NotFoundError("User không tồn tại!")
    }
    return user
  }
  static async getUserById({ userId }) {
    const user = await User.findOne({ where: { id: userId, provider: null } })
    if (!user) {
      throw new NotFoundError("User không tồn tại!")
    }
    return user
  }
  static async handleUpload(file) {
    console.log("file::", file)
    const res = await cloudinary.uploader.upload(file.path, {
      public_id: "avatar_upload",
    })
    return res
  }

  static async updateProfile({ name, picture, desc, userId }) {
    const foundUser = await User.findByPk(userId)
    if (!foundUser) throw new NotFoundError("Not found user!")
    await foundUser.update({
      name,
      picture,
      desc,
    })
    return await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    })
  }
}

module.exports = UserService
