var GoogleStrategy = require("passport-google-oauth20").Strategy

const GooglePassport = new GoogleStrategy(
  {
    clientID:
      "434939803509-krh0la48iqau8mk8dush6496j0f430k1.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5173/auth/google/callback",
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
