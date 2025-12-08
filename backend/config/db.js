const mongoose = require("mongoose");
require("dotenv").config();
const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Connection Error", error);
    process.exit(1);
  }
};
module.exports = connectdb;
