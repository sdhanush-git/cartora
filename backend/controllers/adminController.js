import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";
import OrderModel from "../models/OrderModel.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalProducts = await ProductModel.countDocuments();
    const activeProducts = await ProductModel.countDocuments({ isActive: { $ne: false } });
    const totalUsers = await UserModel.countDocuments();
    const totalOrders = await OrderModel.countDocuments();
    const pendingOrders = await OrderModel.countDocuments({ status: "Pending" });
    const lowStockCount = await ProductModel.countDocuments({ stock: { $lte: 5 } });

    const revenueAggregation = await OrderModel.aggregate([
      {
        $match: { status: { $ne: "Cancelled" } }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" }
        }
      }
    ]);

    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    const recentOrders = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("user", "username email");

    const lowStockList = await ProductModel.find({ stock: { $lte: 5 } })
      .sort({ stock: 1 })
      .limit(6)
      .select("name price stock image category isActive");

    // Orders by status for quick breakdown
    const statusAggregation = await OrderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalProducts,
      activeProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      lowStockProducts: lowStockCount,
      recentOrders,
      lowStockList,
      statusBreakdown: statusAggregation.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to load statistics." });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const { q, role, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (q) {
      query.$or = [
        { username: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await UserModel.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const usersWithOrderCount = await Promise.all(users.map(async (user) => {
        const orderCount = await OrderModel.countDocuments({ user: user._id });
        return { ...user.toObject(), orderCount };
    }));

    const count = await UserModel.countDocuments(query);
    
    res.json({
      users: usersWithOrderCount,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalUsers: count
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to load users." });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userToUpdate = await UserModel.findById(req.params.id);
    
    if (!userToUpdate) return res.status(404).json({ message: "User not found" });
    
    if (userToUpdate.role === "admin" && role !== "admin") {
       const adminCount = await UserModel.countDocuments({ role: "admin" });
       if (adminCount <= 1) {
         return res.status(400).json({ message: "Cannot remove the last admin account." });
       }
    }
    
    userToUpdate.role = role;
    await userToUpdate.save();
    
    const u = userToUpdate.toObject();
    delete u.password;
    res.json({ message: "User role updated successfully", user: u });
  } catch (error) {
    res.status(500).json({ message: "Unable to update user role." });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Unable to load user orders." });
  }
};

