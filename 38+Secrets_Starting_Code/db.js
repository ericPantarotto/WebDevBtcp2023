import "dotenv/config";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";

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

export const User = new mongoose.model("User", userSchema);
