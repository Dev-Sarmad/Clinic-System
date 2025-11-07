import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../models/userModel.js";
const authenticationMiddleware = async (req, res, next) => {
  try {
    let token;
    //cheching if the token sent by the client in cookies if yes then get it
    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) throw new Error("You are not authenticated");
    const decoded = jwt.verify(token, config.jwt_secret);
    const { id, role } = decoded;
    const user = await User.findById(id);
    if (!user) throw new Error("User not Found");

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
};
export default authenticationMiddleware;
