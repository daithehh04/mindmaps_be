const { SuccessResponse, CREATED } = require("../core/success.response")
const AuthService = require("../services/auth.service")
const UserService = require("../services/user.service")

class UserController {
  static handleUpload = async (req, res) => {
    new SuccessResponse({
      message: "upload image success!",
      metadata: await UserService.handleUpload(req.file),
    }).send(res)
  }
  static updateProfile = async (req, res) => {
    new SuccessResponse({
      message: "update profile success!",
      metadata: await UserService.updateProfile(req.body),
    }).send(res)
  }
}

module.exports = UserController
