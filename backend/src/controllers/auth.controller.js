import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { check, body, validationResult } from "express-validator";
import User from "../models/user.model.js";

dotenv.config();

export const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed.",
        errors: errors.array(),
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "A user with this email could not be found.",
      });
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(401).json({
        message: "Wrong password.",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      token: token,
      refreshToken: refreshToken,
      userId: user._id.toString(),
      user: { email: user.email, name: user.name, _id: user._id },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const logout = (req, res, next) => {
  res.status(200).json({ message: "Logout successful." });
};

export const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      const token = jwt.sign(
        {
          email: result.email,
          userId: result._id.toString(),
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        {
          email: result.email,
          userId: result._id.toString(),
        },
        process.env.REFRESH_TOKEN,
        { expiresIn: "12h" }
      );
      res.status(201).json({
        token: token,
        refreshToken: refreshToken,
        message: "User created!",
        userId: result._id,
        user: { email: result.email, name: result.name, _id: result._id },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const refresh = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    const refreshToken = req.body.refresh_token;
    if (!refreshToken) {
      const error = new Error("No refresh token provided.");
      error.statusCode = 401;
      throw error;
    }
    let decodedToken;
      
    decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    if (!decodedToken) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      refreshToken: refreshToken,
      userId: user._id.toString(),
      user: { email: user.email, name: user.name, _id: user._id },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};