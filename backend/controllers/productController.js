import ProductModel from "../models/ProductModel.js";

// dest get all products
//@route Get/ api/products

export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();

    res.json(products);
  } catch (error) {
    res.status(400).json({ message: "Error from getProducts", error });
  }
};

//@desc post poducts by admin
//@route Post/api/products
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;

    const product = new ProductModel({
      name,
      price,
      description,
      image,
      category,
      stock,
    });

    await product.save();

    res.status(201).json({ message: "Product posted", product: product });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

//@desc update poducts by admin
//@route put/api/products

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error updating product", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.json(error);
  }
};
