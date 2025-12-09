import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashed });

  generateToken(user._id, res);

  res.json({ message: "Registered", user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  generateToken(user._id, res);

  res.json({ message: "Logged in", user });
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const { name, currentPassword, newPassword, address } = req.body;

  console.log("Update Profile Request Body:", req.body);
  console.log("Address received:", address);

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User before update:", user);

    // Update name
    if (name) {
      user.name = name;
    }

    // Update address if provided
    if (address) {
      user.address = {
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zipCode: address.zipCode || "",
        country: address.country || ""
      };
      user.markModified('address');
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    console.log("User after save:", user);

    const userResponse = await User.findById(user._id).select("-password");
    
    res.json({ message: "Profile updated successfully", user: userResponse });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};
