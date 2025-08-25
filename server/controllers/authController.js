  import User from "../models/User.js";
  import jwt from "jsonwebtoken";

  const cookieOpts = () => {
    const isProd = process.env.NODE_ENV === "production";
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax", // <-- cross-site safe in prod
      maxAge: 7 * 24 * 60 * 60 * 1000
    };
  };

  const setToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, cookieOpts());
  };

  export const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ message: "User already exists" }); // <-- 409

      const user = await User.create({ name, email, password });
      setToken(res, user._id);
      return res.status(201).json({ message: "User registered", user: { id: user._id, email: user.email } });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      setToken(res, user._id);
      return res.status(200).json({ message: "Login successful", user: { id: user._id, email: user.email } });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  export const logout = async (_req, res) => {
    res.clearCookie("token", cookieOpts());
    return res.status(200).json({ message: "Logged out" });
  };

  export const getCurrentUser = async (req, res) => {
    try {
      // req.userId set by protect()
      const user = await User.findById(req.userId).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
