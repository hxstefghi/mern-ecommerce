import User from "../models/User.js";

// Get the user's saved cart (populated)
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart.product');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cart = (user.cart || []).map((it) => ({
      _id: it.product?._id || null,
      name: it.product?.name || '',
      image: it.product?.image || '',
      price: it.product?.price || 0,
      quantity: it.quantity
    }));

    res.json({ cart });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ message: 'Failed to get cart' });
  }
};

// Update/replace the user's cart. Expects { cart: [{ product, quantity }] }
export const updateCart = async (req, res) => {
  try {
    const { cart } = req.body; // array of { product, quantity }
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Replace cart entirely with incoming cart (no merge)
    user.cart = (cart || []).map((it) => {
      const pid = it.product || it._id || it.productId;
      const q = Number(it.quantity) || 1;
      return { product: pid, quantity: q };
    }).filter((it) => it.product); // Remove any invalid entries

    await user.save();

    // Populate and return full cart
    await user.populate('cart.product');
    const responseCart = (user.cart || []).map((it) => ({
      _id: it.product?._id || null,
      name: it.product?.name || '',
      image: it.product?.image || '',
      price: it.product?.price || 0,
      quantity: it.quantity
    }));

    res.json({ cart: responseCart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Failed to update cart' });
  }
};

// Merge local cart with server cart (used on login). Expects { cart: [{ product, quantity }] }
export const mergeCart = async (req, res) => {
  try {
    const { cart } = req.body; // array of { product, quantity }
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Build map from existing cart
    const existingMap = {};
    (user.cart || []).forEach((it) => {
      existingMap[it.product.toString()] = it.quantity;
    });

    // Merge incoming cart (add quantities)
    (cart || []).forEach((it) => {
      const pid = it.product || it._id || it.productId;
      if (!pid) return;
      const q = Number(it.quantity) || 1;
      existingMap[pid] = (existingMap[pid] || 0) + q;
    });

    // Replace user.cart with merged entries
    user.cart = Object.keys(existingMap).map((pid) => ({ product: pid, quantity: existingMap[pid] }));
    await user.save();

    // Populate and return full cart
    await user.populate('cart.product');
    const responseCart = (user.cart || []).map((it) => ({
      _id: it.product?._id || null,
      name: it.product?.name || '',
      image: it.product?.image || '',
      price: it.product?.price || 0,
      quantity: it.quantity
    }));

    res.json({ cart: responseCart });
  } catch (error) {
    console.error('Error merging cart:', error);
    res.status(500).json({ message: 'Failed to merge cart' });
  }
};
