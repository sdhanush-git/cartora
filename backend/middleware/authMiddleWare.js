import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "User not authorized!",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.authorized = true;
    req.user = decode;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

export const admin = async (req, res, next) => {
  const user = await UserModel.findById(req.user.id);
  try {
    if (user.role == "admin") {
      next();
    } else {
      res.json("You are not authroized as admin");
    }
  } catch (error) {
    console.log(error);
  }
};
