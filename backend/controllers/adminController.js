import ProductModel from "../models/ProductModel.js";
import UserModel from "../models/UserModel.js";
import OrderModel from "../models/OrderModel.js";

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      totalUsers,
      totalOrders,
      pendingOrders,
      lowStockCount,
      revenueAggregation,
      recentOrders,
      lowStockList,
      statusAggregation
    ] = await Promise.all([
      ProductModel.countDocuments(),
      ProductModel.countDocuments({ isActive: { $ne: false } }),
      UserModel.countDocuments(),
      OrderModel.countDocuments(),
      OrderModel.countDocuments({ status: "Pending" }),
      ProductModel.countDocuments({ stock: { $lte: 5 } }),
      OrderModel.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
      ]),
      OrderModel.find({})
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("user", "username email")
        .lean(),
      ProductModel.find({ stock: { $lte: 5 } })
        .sort({ stock: 1 })
        .limit(6)
        .select("name price stock image category isActive")
        .lean(),
      OrderModel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ])
    ]);

    const totalRevenue = revenueAggregation?.[0]?.totalRevenue || 0;

    const statusBreakdown = (statusAggregation || []).reduce((acc, curr) => {
      if (curr?._id) acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json({
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      totalUsers: totalUsers || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      pendingOrders: pendingOrders || 0,
      lowStockProducts: lowStockCount || 0,
      recentOrders: recentOrders || [],
      lowStockList: lowStockList || [],
      statusBreakdown
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Unable to load statistics.", error: error.message });
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

