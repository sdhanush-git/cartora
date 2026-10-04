import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey123";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Please log in.",
    });
  }

  try {
    const decode = jwt.verify(token, JWT_SECRET);

    req.authorized = true;
    req.user = decode;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Please log in.",
    });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (user && user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Admin access required." });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Admin access required." });
  }
};
