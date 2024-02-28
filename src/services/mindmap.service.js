const { Mindmap, User } = require("../models/index")
const { NotFoundError, BadRequestError } = require("../core/error.response")
const { Op } = require("sequelize")

class MindmapService {
  static getAllMindmap = async ({
    page,
    limit,
    userId,
    status,
    favorite,
    key,
    q,
  }) => {
    console.log("userId::", userId)
    const options = {
      order: [["created_at", "desc"]],
      where: {
        user_id: userId,
      },
    }
    if (q) {
      options.where.title = {
        [Op.iLike]: `%${q}%`,
      }
    }

    if (key) {
      if (key === "new") {
        Object.assign(options, {
          order: [["created_at", "desc"]],
        })
      }
      if (key === "old") {
        Object.assign(options, {
          order: [["created_at", "asc"]],
        })
      }
      if (key === "top") {
        Object.assign(options, {
          order: [["title", "asc"]],
        })
      }
      if (key === "bottom") {
        Object.assign(options, {
          order: [["title", "desc"]],
        })
      }
    }

    if (status) {
      options.where.status = status
    }

    if (favorite) {
      options.where.favorite = favorite
    }

    if (!+page || page < 0) {
      page = 1
    }

    if (limit && Number.isInteger(+limit)) {
      options.limit = limit
      const offset = (page - 1) * limit
      options.offset = offset
    }

    const { rows: mindmaps, count } = await Mindmap.findAndCountAll(options)
    return {
      mindmaps,
      count,
    }
  }

  static getAllMindmapDeleted = async ({ page, limit, userId, key, q }) => {
    const options = {
      order: [["created_at", "desc"]],
      paranoid: false,
      where: {
        deleted_at: { [Op.ne]: null },
        user_id: userId,
      },
    }
    if (q) {
      options.where.title = {
        [Op.iLike]: `%${q}%`,
      }
    }
    if (key) {
      if (key === "new") {
        Object.assign(options, {
          order: [["created_at", "desc"]],
        })
      }
      if (key === "old") {
        Object.assign(options, {
          order: [["created_at", "asc"]],
        })
      }
      if (key === "top") {
        Object.assign(options, {
          order: [["title", "asc"]],
        })
      }
      if (key === "bottom") {
        Object.assign(options, {
          order: [["title", "desc"]],
        })
      }
    }
    if (!+page || page < 0) {
      page = 1
    }

    if (limit && Number.isInteger(+limit)) {
      options.limit = limit
      const offset = (page - 1) * limit
      options.offset = offset
    }
    const { rows: mindmaps, count } = await Mindmap.findAndCountAll(options)
    return {
      mindmaps,
      num: mindmaps.length,
      count,
    }
  }

  static getMindmapById = async ({ id }) => {
    const map = await Mindmap.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    })
    if (!map) {
      throw new NotFoundError("Mindmap không tồn tại!")
    }
    return map
  }

  static createMindmap = async (payload) => {
    const { id, user, title, desc, img, status, nodes, edges } = payload
    const userExist = await User.findByPk(user.id)
    if (!userExist) {
      await User.create({ ...user })
    }
    const mindmap = {
      id,
      user_id: user.id,
      title,
      desc,
      img,
      status,
      nodes,
      edges,
    }
    const map = await Mindmap.create(mindmap)
    if (!map) throw new BadRequestError("create new mindmap error")
    return mindmap
  }

  static updateMindmap = async ({ id, payload }) => {
    const map = await Mindmap.findByPk(id)
    if (!map) {
      throw new NotFoundError("Mindmap không tồn tại!")
    }
    await Mindmap.update(payload, {
      where: {
        id,
      },
    })
    return await Mindmap.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    })
  }

  static deleteMindmap = async ({ id }) => {
    const map = await Mindmap.findByPk(id)
    if (!map) {
      throw new NotFoundError("Mindmap không tồn tại!")
    }
    const d = await Mindmap.destroy({
      where: {
        id,
      },
    })
    return id
  }

  static forceDeleteMindmap = async ({ id }) => {
    const map = await Mindmap.findByPk(id, {
      paranoid: false,
    })
    if (!map) {
      throw new NotFoundError("Mindmap không tồn tại!")
    }
    const d = await Mindmap.destroy({
      where: {
        id,
      },
      force: true,
    })
    return d
  }

  static deleteAllMindmaps = async ({ ids }) => {
    const mindmaps = await Mindmap.destroy({
      where: {
        id: ids,
      },
    })
    return ids
  }

  static restoreMindmap = async ({ id }) => {
    const map = await Mindmap.findByPk(id, {
      paranoid: false,
    })
    if (!map) {
      throw new NotFoundError("Mindmap không tồn tại!")
    }
    const rs = await Mindmap.restore({
      where: {
        id,
      },
    })
    return id
  }

  static restoreAllMindmap = async ({ ids }) => {
    const rs = await Mindmap.restore({
      where: { id: { [Op.in]: ids } },
    })
    return ids
  }
}

module.exports = MindmapService
