import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const genToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
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
    });

    const token = genToken(user._id);

    user.token = token;

    await user.save();

    res.status(201).json({
      user,
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

    res.json({
      message: "Login Successfully",
      user: userExists,
      token,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
