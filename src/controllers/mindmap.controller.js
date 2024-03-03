"use strict"
const { SuccessResponse } = require("../core/success.response")
const MindmapService = require("../services/mindmap.service")
class MindmapController {
  static getAllMindmap = async (req, res) => {
    new SuccessResponse({
      message: "Get all mindmaps success!",
      metadata: await MindmapService.getAllMindmap({
        ...req.query,
        ...req.user,
      }),
    }).send(res)
  }

  static getAllMindmapDeleted = async (req, res) => {
    new SuccessResponse({
      message: "Get all mindmaps deleted success!",
      metadata: await MindmapService.getAllMindmapDeleted(req.query),
    }).send(res)
  }

  static getMindmapById = async (req, res) => {
    new SuccessResponse({
      message: "Get mindmap success!",
      metadata: await MindmapService.getMindmapById(req.params),
    }).send(res)
  }

  static createMindmap = async (req, res) => {
    new SuccessResponse({
      message: "Create mindmap success!",
      metadata: await MindmapService.createMindmap(req.body),
    }).send(res)
  }

  static updateMindmap = async (req, res) => {
    new SuccessResponse({
      message: "Update mindmap success!",
      metadata: await MindmapService.updateMindmap({
        id: req.params.id,
        payload: req.body,
      }),
    }).send(res)
  }

  static deleteMindmap = async (req, res) => {
    new SuccessResponse({
      message: "Delete mindmap success!",
      metadata: await MindmapService.deleteMindmap(req.params),
    }).send(res)
  }

  static deleteAllMindmaps = async (req, res) => {
    new SuccessResponse({
      message: "Delete mindmaps success!",
      metadata: await MindmapService.deleteAllMindmaps(req.body),
    }).send(res)
  }

  static forceDeleteMindmap = async (req, res) => {
    new SuccessResponse({
      message: "Delete mindmaps success!",
      metadata: await MindmapService.forceDeleteMindmap(req.params),
    }).send(res)
  }

  static restoreMindmap = async (req, res) => {
    new SuccessResponse({
      message: "Restored mindmaps success!",
      metadata: await MindmapService.restoreMindmap(req.params),
    }).send(res)
  }
  static restoreAllMindmap = async (req, res) => {
    new SuccessResponse({
      message: "Restored all mindmaps success!",
      metadata: await MindmapService.restoreAllMindmap(req.body),
    }).send(res)
  }
}

module.exports = MindmapController
