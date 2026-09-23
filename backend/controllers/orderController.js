import orderModel from "../models/OrderModel.js";
import OrderModels from "../models/OrderModel.js";

export const createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice, Address } = req.body;

    if (orderItems && orderItems.length == 0) {
      res.status(400).json({ message: "Order not found" });
      return;
    }

    const orderData = new OrderModels({
      user: req.user.id,
      orderItems,
      totalPrice,
      Address,
    });

    const createOrder = await orderData.save();

    res.status(201).json(createOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const myOrders = await OrderModels.find({ user: req.user.id });

    res.json(myOrders);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getMyOrder = async (req, res) => {
  try {
    const myOrder = await OrderModels.findById(req.params.id);

    res.json(myOrder.orderItems);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// GET    /api/orders          ← admin
// PUT    /api/orders/:id/status

export const getAllOrders = async (req, res) => {
  try {
    const allOrders = await OrderModels.find({});
    res.json(allOrders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOrders = async (req, res) => {
  try {
    const { status } = req.body;

    const Order = await OrderModels.findById(req.params.id);

    if (!Order) {
      res.json("Order not found");
      return;
    }

    Order.status = status;

    const updatedOrder = await Order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
