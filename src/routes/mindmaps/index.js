"use strict"

const express = require("express")
const asyncHandler = require("../../helpers/asyncHandler")
const MindmapController = require("../../controllers/mindmap.controller")
const { authentication } = require("../../auth/authUtils")
const router = express.Router()

router.get("/deleted", asyncHandler(MindmapController.getAllMindmapDeleted))
router.get("/:id", asyncHandler(MindmapController.getMindmapById))
router.use(authentication)
router.get("/", asyncHandler(MindmapController.getAllMindmap))

router.get("/restore/:id", asyncHandler(MindmapController.restoreMindmap))
router.post("/restore", asyncHandler(MindmapController.restoreAllMindmap))
router.post("/", asyncHandler(MindmapController.createMindmap))
router.post("/delete", asyncHandler(MindmapController.deleteAllMindmaps))

router.patch("/:id", asyncHandler(MindmapController.updateMindmap))

router.delete("/:id", asyncHandler(MindmapController.deleteMindmap))
router.delete("/delete/:id", asyncHandler(MindmapController.forceDeleteMindmap))

module.exports = router
