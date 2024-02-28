const { keyToken } = require("../models/index")
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    const tokens = await keyToken.create({
      user_id: userId,
      public_key: publicKey,
      private_key: privateKey,
      refresh_token: refreshToken,
    })
    return tokens ? tokens.public_key : null
  }
  static findByUserId = async (userId) => {
    return await keyToken.findOne({ where: { user_id: userId } })
  }
  static removeKeyById = async (id) => {
    return await keyToken.destroy({
      where: { user_id: id },
    })
  }
  static createOrUpdateKeyToken = async ({
    userId,
    refreshToken,
    publicKey,
    privateKey,
  }) => {
    const [tokens, created] = await keyToken.findOrCreate({
      where: { user_id: userId },
      defaults: {
        user_id: userId,
        public_key: publicKey,
        private_key: privateKey,
        refresh_token: refreshToken,
      },
    })
    if (!created) {
      // Nếu đã tồn tại, cập nhật thông tin
      await keyToken.update(
        {
          public_key: publicKey,
          private_key: privateKey,
          refresh_token: refreshToken,
        },
        {
          where: {
            user_id: userId,
          },
        }
      )
    }
    return tokens ? tokens.public_key : null
  }
}

module.exports = KeyTokenService
