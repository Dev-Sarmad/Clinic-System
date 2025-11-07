import User from "../models/userModel.js";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../validation/validation.js";
import config from "../config/config.js";

const createUser = async (req, res) => {
  try {
    const validationResult = await userRegistrationSchema.safeParseAsync(
      req.body
    );
    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.format() });
    }
    const { name, email, password, gender, role, phone } =
      validationResult.data;
    if (role && role !== "patient") {
      return res
        .status(403)
        .json({ message: "Cannot register as admin or doctor" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `User's ${email} already exists ` });
    }
    const user = await new User({
      name,
      email,
      password,
      role,
      gender,
      phone,
    });
    await user.save();
    res.status(201).json({
      message: "User created successfully",
      id: user._id,
      role: user.role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const validationResult = await userLoginSchema.safeParseAsync(req.body);
    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.format() });
    }
    const { email, password } = validationResult.data;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = await user.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: config.node_env === "production",
    });
    res.status(200).json({
      message: "Logged In successfully",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const logoutUser = async (req, res) => {
  await res.cookies("token", null, { expires: new Date(Date.now()) });
};
export { createUser, loginUser, logoutUser };
