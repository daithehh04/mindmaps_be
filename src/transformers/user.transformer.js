const Transformer = require("../core/transformer")

class UserTransformer extends Transformer {
  response(instance) {
    return {
      id: instance.id,
      name: instance.name,
      email: instance.email,
      picture: instance.picture,
      provider: instance.provider,
      expiredAt: instance.expired_at,
      idReset: instance.id_reset,
      status: instance.status,
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
    }
  }
}

module.exports = UserTransformer
