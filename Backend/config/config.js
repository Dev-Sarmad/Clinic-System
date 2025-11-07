import "dotenv/config";

const config = {
  port: process.env.PORT || 8000,
  jwt_secret: process.env.JWT_SECRET,
  mongodb_connection_string: process.env.MONGODB_CONNECTION_URL,
  node_env: process.env.NODE_ENV,
  ADMIN_EMAIL : process.env.DEFAULT_ADMIN_EMAIL,
  ADMIN_NAME :process.env.DEFAULT_ADMIN_NAME,
  ADMIN_PASSWORD : process.env.DEFAULT_ADMIN_PASSWORD
};
export default Object.freeze(config);
