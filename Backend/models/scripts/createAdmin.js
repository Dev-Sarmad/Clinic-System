import User from "../userModel.js";
import config from "../../config/config.js";
const createAdmin = async () => {
  try {
    const existing = await User.findOne({ role: "admin" }).lean();
    if (existing) {
      console.log("Admin already exists. Exiting.");
      return;
    }
    const adminPassword = config.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("Admin password is not set in environment variables!");
      process.exit(1);
    }
    const admin = new User({
      name: config.ADMIN_NAME,
      email: config.ADMIN_EMAIL,
      password: adminPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin account created:", { email: config.ADMIN_EMAIL });
  } catch (err) {
    console.error("Failed to create admin:", err);
    process.exit(1);
  }
};

export default createAdmin;
