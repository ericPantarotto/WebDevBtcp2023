import "dotenv/config";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

export function connect() {
  mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
  });
}
export const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
userSchema.plugin(encrypt, {
  secret: process.env.SOME_LONG_UNGUESSABLE_STRING,
  encryptedFields: ["password"],
});
//NOTE: plugin to hash and salt our user's password in our mongoDB db
userSchema.plugin(passportLocalMongoose);

export const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function (user, done) {
  done(null, user.email);
});

passport.deserializeUser(function (id, done) {
  User.findOne(id, function (err, user) {
    done(err, user);
  });
});
