"use strict"

const express = require("express")
const router = express.Router()

router.use("/v1/api/auth", require("./auth"))
router.use("/v1/api/user", require("./user"))
router.use("/v1/api/mindmaps", require("./mindmaps"))

module.exports = router
