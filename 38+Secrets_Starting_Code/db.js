import "dotenv/config";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import findOrCreate from "mongoose-findorcreate";
import passport from "passport";
import strategy from "passport-google-oauth20";
import passportLocalMongoose from "passport-local-mongoose";

export function connect() {
  mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
  });
}
export const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String,
});
userSchema.plugin(encrypt, {
  secret: process.env.SOME_LONG_UNGUESSABLE_STRING,
  encryptedFields: ["password"],
});
//NOTE: plugin to hash and salt our user's password in our mongoDB db
userSchema.plugin(passportLocalMongoose);
//NOTE: https://www.npmjs.com/package/mongoose-findorcreate (use for Google OAuth 2.0)
userSchema.plugin(findOrCreate);

export const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.use(
  new strategy.Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  await User.findOne({ _id: id })
    .then((user) => {
      done(null, user);
    })
    .catch(function (err) {
      console.log(err);
    });
});
