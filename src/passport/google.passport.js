var GoogleStrategy = require("passport-google-oauth20").Strategy

const GooglePassport = new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.CLIENT_SECRET_GOOGLE,
    callbackURL: process.env.CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, cb) => {
    const user = {
      email: profile?._json?.email,
      name: profile?._json?.name,
      picture: profile?._json?.picture,
    }
    return cb(null, user)
  }
)

module.exports = GooglePassport
