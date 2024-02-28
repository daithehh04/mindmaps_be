const { SuccessResponse, CREATED } = require("../core/success.response")
const AuthService = require("../services/auth.service")

class AuthController {
  static handleLoginWithGoogle = async (req, res) => {
    new SuccessResponse({
      message: "Login with Google Success!",
      metadata: await AuthService.handleLoginWithGoogle(req),
    }).send(res)
  }

  static handleLoginWithGoogleCallback = async (req, res) => {
    new SuccessResponse({
      message: "Login with Google Success!",
      metadata: await AuthService.handleLoginWithGoogleCallback(req),
    }).send(res)
  }
  static handlerRefreshToken = async (req, res) => {
    new SuccessResponse({
      message: "Get token Success!",
      metadata: await AuthService.handlerRefreshToken({
        ...req.body.refreshToken,
        ...req.user,
      }),
    }).send(res)
  }
  static getUserFromToken = async (req, res) => {
    new SuccessResponse({
      message: "Get user Success!",
      metadata: await AuthService.getUserFromToken(req.user),
    }).send(res)
  }
  static login = async (req, res) => {
    new SuccessResponse({
      message: "Login Success!",
      metadata: await AuthService.login(req.body),
    }).send(res)
  }
  static signUp = async (req, res) => {
    new CREATED({
      message: "Registered OK!",
      metadata: await AuthService.signUp(req.body),
    }).send(res)
  }

  static logout = async (req, res) => {
    new SuccessResponse({
      message: "Logout Success!",
      metadata: await AuthService.logout(req.user),
    }).send(res)
  }

  static handleForgotPassword = async (req, res) => {
    new SuccessResponse({
      message: "Send Mail Success!",
      metadata: await AuthService.handleForgotPassword(req.body),
    }).send(res)
  }

  static handleResetPassword = async (req, res) => {
    new SuccessResponse({
      message: "Reset Password Success!",
      metadata: await AuthService.handleResetPassword(req.body),
    }).send(res)
  }

  static handleChangePassword = async (req, res) => {
    new SuccessResponse({
      message: "Change Password Success!",
      metadata: await AuthService.handleChangePassword(req.body),
    }).send(res)
  }

  static checkUserFromIdReset = async (req, res) => {
    new SuccessResponse({
      message: "Check user Success!",
      metadata: await AuthService.checkUserFromIdReset(req.body),
    }).send(res)
  }
}

module.exports = AuthController
