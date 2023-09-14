import mongoose from "mongoose";

process.env.SOME_LONG_UNGUESSABLE_STRING;
export function connect() {
  mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
  });
}
export const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

export const User = new mongoose.model("User", userSchema);
