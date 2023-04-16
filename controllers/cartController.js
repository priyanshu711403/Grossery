import Cart from '../models/cartModel.js';

// Add a product to a user's cart
const addProductToCart = async (userId, productId, quantity) => {
  try {
    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product is already in the cart
    const cartItem = cart.items.find(item => item.product.equals(productId));
    if (cartItem) {
      // If the product is already in the cart, update the quantity
      cartItem.quantity += quantity;
    } else {
      // If the product is not in the cart, add it as a new item
      cart.items.push({ product: productId, quantity });
    }

    // Save the updated cart to the database
    await cart.save();

    return cart;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to add product to cart');
  }
};
exports.addItemToCart = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId });
    }
    const item = cart.items.find(item => item.product == productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity: quantity });
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

