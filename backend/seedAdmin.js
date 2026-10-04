import mongoose from "mongoose";
import dotenv from "dotenv";
import UserModel from "./models/UserModel.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await UserModel.findOne({ email: "admin@cartora.com" });
    if (adminExists) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    const adminUser = new UserModel({
      username: "AdminUser",
      email: "admin@cartora.com",
      password: "adminpassword123", // UserModel pre-save hook will hash this automatically
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@cartora.com");
    console.log("Password: adminpassword123");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

seedAdmin();
