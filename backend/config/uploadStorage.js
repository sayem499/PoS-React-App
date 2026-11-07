const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

const uploadDirectory = isProduction
  ? process.env.UPLOAD_DIR || "/var/data/uploads"
  : path.join(__dirname, "..", "storage", "uploads");

console.log("Environment:", process.env.NODE_ENV);
console.log("Upload directory:", uploadDirectory);

module.exports = {
  uploadDirectory,
  isProduction,
};
