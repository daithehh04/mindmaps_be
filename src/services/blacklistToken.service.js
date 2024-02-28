const { blacklistToken } = require("../models/index")

class BlacklistTokenService {
  static findTokenInBlacklist = async (token) => {
    return await blacklistToken.findOne({ where: { token } })
  }
}

module.exports = BlacklistTokenService
