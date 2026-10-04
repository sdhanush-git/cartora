import WishlistModel from "../models/WishlistModel.js";
import ProductModel from "../models/ProductModel.js";
import CartModel from "../models/CartModel.js";

// GET /api/wishlist
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await WishlistModel.findOne({ user: req.user.id }).populate("products");
    if (!wishlist) {
      wishlist = await WishlistModel.create({ user: req.user.id, products: [] });
      return res.json({ products: [] });
    }

    // Filter out deleted or deactivated products
    const initialCount = wishlist.products.length;
    wishlist.products = wishlist.products.filter(
      (prod) => prod != null && prod.isActive !== false
    );

    if (wishlist.products.length !== initialCount) {
      await WishlistModel.updateOne(
        { _id: wishlist._id },
        { products: wishlist.products.map((p) => p._id) }
      );
    }

    res.json({ products: wishlist.products });
  } catch (error) {
    res.status(500).json({ message: "Unable to load wishlist." });
  }
};

// POST /api/wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    const product = await ProductModel.findById(productId);
    if (!product || product.isActive === false) {
      return res.status(404).json({ message: "Product is no longer available." });
    }

    let wishlist = await WishlistModel.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new WishlistModel({ user: req.user.id, products: [] });
    }

    // Prevent duplicates
    const alreadyExists = wishlist.products.some(
      (id) => id.toString() === productId.toString()
    );

    if (!alreadyExists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const updated = await WishlistModel.findById(wishlist._id).populate("products");
    res.json({ message: "Added to wishlist.", products: updated.products });
  } catch (error) {
    res.status(500).json({ message: "Unable to update your wishlist." });
  }
};

// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    let wishlist = await WishlistModel.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.json({ products: [] });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId.toString()
    );
    await wishlist.save();

    const updated = await WishlistModel.findById(wishlist._id).populate("products");
    res.json({ message: "Removed from wishlist.", products: updated.products });
  } catch (error) {
    res.status(500).json({ message: "Unable to update your wishlist." });
  }
};

// POST /api/wishlist/:productId/move-to-cart
export const moveToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await ProductModel.findById(productId);
    if (!product || product.isActive === false) {
      return res.status(404).json({ message: "Product is no longer available." });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ message: "Product is out of stock." });
    }

    // Add to cart
    let cart = await CartModel.findOne({ user: req.user.id });
    if (!cart) {
      cart = new CartModel({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity + 1 > product.stock) {
        return res.status(400).json({ message: `Only ${product.stock} items are available.` });
      }
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }
    await cart.save();

    // Remove from wishlist
    let wishlist = await WishlistModel.findOne({ user: req.user.id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId.toString()
      );
      await wishlist.save();
    }

    const updatedCart = await CartModel.findById(cart._id).populate("items.product");
    const updatedWishlist = wishlist
      ? await WishlistModel.findById(wishlist._id).populate("products")
      : { products: [] };

    res.json({
      message: "Moved to cart.",
      cart: updatedCart,
      wishlist: updatedWishlist.products,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to move item to cart." });
  }
};
