"use strict"

const express = require("express")
const asyncHandler = require("../../helpers/asyncHandler")
const UserController = require("../../controllers/user.controller")
const router = express.Router()
const multer = require("multer")

const storage = multer.diskStorage({})
const upload = multer({ storage, limit: { fileSize: 1024 * 1024 * 100 } }) //limit 100MB

router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(UserController.handleUpload)
)

router.post("/updateProfile", asyncHandler(UserController.updateProfile))

module.exports = router
