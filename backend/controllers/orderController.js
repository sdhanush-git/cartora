import mongoose from "mongoose";
import OrderModels from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import CartModel from "../models/CartModel.js";


export const createOrder = async (req, res) => {
  try {
    const { Address } = req.body;

    const cart = await CartModel.findOne({ user: req.user.id });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "No items in cart." });
    }

    let calculatedSubtotal = 0;
    const finalOrderItems = [];
    const productsToUpdate = [];

    for (const item of cart.items) {
      const product = await ProductModel.findById(item.product);
      
      if (!product) {
        return res.status(400).json({ message: "One or more products in your order are no longer available." });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Only ${product.stock} items are available for ${product.name}.` });
      }

      const price = Number(product.price);
      calculatedSubtotal += price * item.quantity;

      finalOrderItems.push({
        product: product._id,
        name: product.name,
        price: price,
        quantity: item.quantity,
        image: product.image,
      });

      productsToUpdate.push({
        product,
        quantity: item.quantity
      });
    }

    const delivery = calculatedSubtotal >= 5000 ? 0 : 99;
    const calculatedTotal = calculatedSubtotal + delivery;

    for (const update of productsToUpdate) {
      update.product.stock = Math.max(0, update.product.stock - update.quantity);
      await update.product.save();
    }

    const orderData = new OrderModels({
      user: req.user.id,
      orderItems: finalOrderItems,
      totalPrice: calculatedTotal,
      Address,
    });

    const createOrder = await orderData.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully.",
      order: createOrder
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to place order. Please try again." });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const myOrders = await OrderModels.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(myOrders);
  } catch (error) {
    res.status(500).json({ message: "Unable to load orders." });
  }
};

export const getMyOrder = async (req, res) => {
  try {
    const myOrder = await OrderModels.findById(req.params.id);

    if (!myOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Verify ownership: authenticated user must be the owner, or an admin
    if (myOrder.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. You cannot view another user's order.",
      });
    }

    res.status(200).json(myOrder);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve order details.",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { q, status } = req.query;
    
    let query = {};
    if (status) query.status = status;
    
    if (q) {
      const trimmed = q.trim();
      const orConditions = [
        { "Address.fullName": { $regex: trimmed, $options: "i" } },
        { "Address.phone": { $regex: trimmed, $options: "i" } },
        { "Address.city": { $regex: trimmed, $options: "i" } }
      ];
      if (mongoose.Types.ObjectId.isValid(trimmed) && trimmed.length === 24) {
        orConditions.push({ _id: new mongoose.Types.ObjectId(trimmed) });
      }
      query.$or = orConditions;
    }

    const allOrders = await OrderModels.find(query).sort({ createdAt: -1 }).populate("user", "username email");
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ message: "Unable to load orders." });
  }
};


export const updateOrders = async (req, res) => {
  try {
    const { status } = req.body;

    const Order = await OrderModels.findById(req.params.id);

    if (!Order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const validStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
    
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    if (!validStatuses.includes(formattedStatus)) {
        return res.status(400).json({ message: "Invalid order status" });
    }

    const previousStatus = Order.status;
    Order.status = formattedStatus;

    // Inventory policy: if order is Cancelled, return items back to stock
    if (previousStatus !== "Cancelled" && formattedStatus === "Cancelled") {
      for (const item of Order.orderItems) {
        if (item.product) {
          await ProductModel.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
      }
    } else if (previousStatus === "Cancelled" && formattedStatus !== "Cancelled") {
      // If moving away from Cancelled, re-decrement stock if available
      for (const item of Order.orderItems) {
        if (item.product) {
          const prod = await ProductModel.findById(item.product);
          if (prod) {
            prod.stock = Math.max(0, prod.stock - item.quantity);
            await prod.save();
          }
        }
      }
    }

    const updatedOrder = await Order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: "Unable to update order status." });
  }
};
