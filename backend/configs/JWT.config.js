import "dotenv/config";

export default {
    jwtSecretKey:      process.env.JWT_SECRET,
    cookieExpire:      parseInt(process.env.COOKIE_EXPIRE) || 15,
    googleClientId:     process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    facebookAppId:      process.env.FACEBOOK_APP_ID,
    facebookAppSecret:  process.env.FACEBOOK_APP_SECRET,
};
