import ProductModel from "../models/ProductModel.js";

// dest get all products
//@route Get/ api/products

export const getProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, inStock, sort, isActive, all } = req.query;

    let query = {};

    if (all === "true") {
      // allow seeing all (admin)
    } else if (isActive !== undefined) {
      query.isActive = isActive === "true";
    } else {
      query.isActive = { $ne: false };
    }

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (inStock === "true") {
      query.stock = { $gt: 0 };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "name_asc") sortOption = { name: 1 };
    else if (sort === "name_desc") sortOption = { name: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    const products = await ProductModel.find(query).sort(sortOption);
    res.json(products);
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ message: "Unable to load products.", error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await ProductModel.aggregate([
      { $match: { isActive: { $ne: false } } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          image: { $first: "$image" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    if (req.query.details === "true") {
      return res.json(
        categories
          .filter((c) => c._id)
          .map((c) => ({
            name: c._id,
            count: c.count,
            image: c.image,
          }))
      );
    }

    const distinct = categories.map((c) => c._id).filter(Boolean);
    res.json(distinct);
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.status(500).json({ message: "Unable to load categories.", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product || product.isActive === false) {
      return res.status(404).json({ message: "Product is no longer available." });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Unable to load product details." });
  }
};

//@desc post poducts by admin
//@route Post/api/products
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;

    const parsedStock = Number(stock);
    if (parsedStock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative." });
    }

    const parsedPrice = Number(price);
    if (parsedPrice <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0." });
    }

    const product = new ProductModel({
      name,
      price: parsedPrice,
      description,
      image,
      category,
      stock: Math.max(0, parsedStock || 0),
    });

    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Unable to create product." });
  }
};

//@desc update poducts by admin
//@route put/api/products

export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.isActive !== undefined) {
      updateData.isActive = Boolean(updateData.isActive);
    }
    if (updateData.stock !== undefined) {
      const parsedStock = Number(updateData.stock);
      if (parsedStock < 0) {
        return res.status(400).json({ message: "Stock cannot be negative." });
      }
      updateData.stock = Math.max(0, parsedStock);
    }
    if (updateData.price !== undefined) {
      const parsedPrice = Number(updateData.price);
      if (parsedPrice <= 0) {
        return res.status(400).json({ message: "Price must be greater than 0." });
      }
      updateData.price = parsedPrice;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Unable to update product." });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete product." });
  }
};
