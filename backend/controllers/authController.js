import UserModel from "../models/UserModel.js";
import OrderModel from "../models/OrderModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey123";

const genToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
};
//   try {
//     console.log(process.env.JWT_SECRET);
//     const { username, email, password } = req.body;

//     const userExists = await UserModel.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({
//         message: "User already exists",
//       });
//     }

//     const user = await UserModel.create({
//       username,
//       email,
//       password,
//     });

//     const token = await genToken(user._id);

//     user.token = token;

//     await user.save();

//     res.status(201).json({
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// };

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await UserModel.create({
      username,
      email,
      password,
      role: "user",
    });

    const token = genToken(user._id);

    user.token = token;

    await user.save();

    const userResponse = await UserModel.findById(user._id).select("-password");

    res.status(201).json({
      user: userResponse,
      token,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error 1",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await UserModel.findOne({ email });

    if (!userExists) {
      return res.status(400).json({
        message: "Enter correct email",
      });
    }

    const isMatch = await bcrypt.compare(password, userExists.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password!",
      });
    }

    const token = genToken(userExists._id);

    userExists.token = token;

    await userExists.save();

    const userResponse = await UserModel.findById(userExists._id).select("-password");

    res.json({
      message: "Login Successfully",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const orderCount = await OrderModel.countDocuments({ user: req.user.id });
    res.json({ ...user.toObject(), orderCount });
  } catch (error) {
    res.status(500).json({
      message: "Unable to load profile.",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { username, phone, address } = req.body;
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (username) {
      if (username.trim().length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters." });
      }
      user.username = username.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (address && typeof address === "object") {
      user.address = {
        address: address.address || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
      };
    }

    await user.save();
    const orderCount = await OrderModel.countDocuments({ user: req.user.id });
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ message: "Profile updated successfully.", user: { ...userObj, orderCount } });
  } catch (error) {
    res.status(500).json({ message: "Unable to update profile." });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All password fields are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters long." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match." });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Unable to change password." });
  }
};
