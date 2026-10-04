import CartModel from "../models/CartModel.js";
import ProductModel from "../models/ProductModel.js";

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    let cart = await CartModel.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) {
      cart = await CartModel.create({ user: req.user.id, items: [] });
      return res.json(cart);
    }

    let modified = false;
    let modifiedMessage = "";

    // Filter out deleted products
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(item => item.product != null);
    
    if (cart.items.length < originalLength) {
      modified = true;
      modifiedMessage = "Some items are no longer available and were removed from your cart.";
    }

    // Adjust quantities based on stock
    cart.items.forEach(item => {
      if (item.quantity > item.product.stock) {
        item.quantity = item.product.stock;
        modified = true;
        if (!modifiedMessage) {
          modifiedMessage = "Some item quantities were reduced due to stock limits.";
        }
      }
    });

    // Remove items that hit 0 stock
    const lengthBeforeZeroStock = cart.items.length;
    cart.items = cart.items.filter(item => item.quantity > 0);
    
    if (cart.items.length < lengthBeforeZeroStock && !modifiedMessage.includes("removed")) {
      modified = true;
      modifiedMessage = "Some items went out of stock and were removed from your cart.";
    }

    if (modified) {
      // Need to resave without populated items, so we just save the current array.
      // Mongoose handles populated subdocuments in save() correctly in recent versions, but to be safe:
      await CartModel.updateOne({ _id: cart._id }, { items: cart.items.map(i => ({ product: i.product._id, quantity: i.quantity })) });
    }

    const response = cart.toObject();
    if (modified) {
      response.modifiedMessage = modifiedMessage;
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Unable to load cart." });
  }
};

// POST /api/cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product is no longer available." });
    
    let cart = await CartModel.findOne({ user: req.user.id });
    if (!cart) {
      cart = new CartModel({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: `Only ${product.stock} items are available.` });
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      if (quantity > product.stock) {
        return res.status(400).json({ message: `Only ${product.stock} items are available.` });
      }
      if (product.stock === 0) {
        return res.status(400).json({ message: "Product is out of stock." });
      }
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const updatedCart = await cart.populate("items.product");
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Unable to add item to cart." });
  }
};

// PUT /api/cart/:productId
export const updateCartItem = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { quantity } = req.body;
    
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product is no longer available." });

    if (quantity > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} items are available.` });
    }
    if (quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity." });
    }

    const cart = await CartModel.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      const updatedCart = await cart.populate("items.product");
      res.json(updatedCart);
    } else {
      res.status(404).json({ message: "Product not in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "Unable to update cart." });
  }
};

// DELETE /api/cart/:productId
export const removeCartItem = async (req, res) => {
  try {
    const productId = req.params.productId;
    const cart = await CartModel.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    
    const updatedCart = await cart.populate("items.product");
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Unable to remove item from cart." });
  }
};

// DELETE /api/cart
export const clearCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ items: [] });
  } catch (error) {
    res.status(500).json({ message: "Unable to clear cart." });
  }
};
