import mongoose from "mongoose";
import UserModel from "./UserModel";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Type.ObjectId,
          ref: "ProductModel",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Process", "Shipped", "Delivered"],
      default: "Pending",
    },
    Address: {
      address: String,
      city: String,
      costalCode: String,
      country: String,
    },
  },
  { timestamps: true },
);

const orderModel = mongoose.model("Order", OrderSchema);

export default orderModel;
