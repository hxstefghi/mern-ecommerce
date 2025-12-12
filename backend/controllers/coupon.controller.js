import Coupon from "../models/Coupon.js";

// Get all coupons (Admin only)
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create coupon (Admin only)
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, expirationDate } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
      expirationDate,
      createdBy: req.user._id
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update coupon (Admin only)
export const updateCoupon = async (req, res) => {
  try {
    const { code, discount, expirationDate, isActive } = req.body;
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    coupon.code = code.toUpperCase() || coupon.code;
    coupon.discount = discount || coupon.discount;
    coupon.expirationDate = expirationDate || coupon.expirationDate;
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete coupon (Admin only)
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Validate and apply coupon (User)
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: "This coupon is no longer active" });
    }

    if (new Date(coupon.expirationDate) < new Date()) {
      return res.status(400).json({ message: "This coupon has expired" });
    }

    res.json({
      code: coupon.code,
      discount: coupon.discount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
