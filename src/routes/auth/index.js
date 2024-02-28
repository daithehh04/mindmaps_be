"use strict"
const express = require("express")
const asyncHandler = require("../../helpers/asyncHandler")
const AuthController = require("../../controllers/auth.controller")
const { authentication, createTokenPair } = require("../../auth/authUtils")
const passport = require("passport")
const router = express.Router()

router.post("/signup", asyncHandler(AuthController.signUp))
router.post("/login", asyncHandler(AuthController.login))
router.post(
  "/handlerRefreshToken",
  asyncHandler(AuthController.handlerRefreshToken)
)
router.post(
  "/handleForgotPassword",
  asyncHandler(AuthController.handleForgotPassword)
)
router.get("/google", AuthController.handleLoginWithGoogle)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  AuthController.handleLoginWithGoogleCallback
)
router.use(authentication)
router.post("/logout", asyncHandler(AuthController.logout))

router.post(
  "/handleResetPassword",
  asyncHandler(AuthController.handleResetPassword)
)
router.post(
  "/handleChangePassword",
  asyncHandler(AuthController.handleChangePassword)
)
router.post(
  "/checkUserFromIdReset",
  asyncHandler(AuthController.checkUserFromIdReset)
)
router.post("/getUserFromToken", asyncHandler(AuthController.getUserFromToken))

module.exports = router
