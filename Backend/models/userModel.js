import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
const userSchema = mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 4,
      select: false,
    },
    phone: {
      type: Number,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
  },
  {
    timeStamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
    // toJSON and toObject give you hooks to control what gets included or removed during that conversion.it’s a Mongoose document with a bunch of built-in methods and metadata.
    //When you send that document as JSON (for example, res.json(user)), Mongoose internally calls .toJSON() on it to convert it to a plain object that can be serialized to JSON.
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

//pre-save middleware for the userSchema in Mongoose. It gets triggered before a document (user) is saved to the database.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ id: this._id, role: this.role }, config.jwt_secret, {
    expiresIn: "7d",
  });
  return token
};

const User = mongoose.model("User", userSchema);

export default User;
