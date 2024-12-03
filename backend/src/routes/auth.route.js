import express from "express";
import * as authController from "../controllers/auth.controller.js";
import isAuth from "../middleware/is-auth.js";
import isRefreshed from "../middleware/is-refreshed.js";
import { body } from "express-validator";

const router = express.Router();
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *      - auth
 *     summary: Login user
 *     description: Login user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Password has to be valid.")
      .isLength({ min: 4 })
      //.isAlphanumeric()
      .trim(),
  ],
  authController.login
);

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     tags:
 *     - auth
 *     summary: Signup user
 *     description: Signup user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - name
 *     responses:
 *       201:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/signup", [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Password has to be valid.")
      .isLength({ min: 4 })
      //.isAlphanumeric()
      .trim(),
    body("name").isLength({ min: 3 }).trim().not().isEmpty(),
  ],
  authController.signup);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *     - auth
 *     summary: Logout user
 *     description: Logout user
 *     responses:
 *       200:
 *         description: A successful response
 *       500:
 *         description: Internal server error
 */
router.post("/logout", isAuth, authController.logout);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags:
 *     - auth
 *     summary: Refresh token
 *     description: Refresh token
 *     responses:
 *       200:
 *         description: A successful response
 *       500:
 *         description: Internal server error
 */
router.post("/refresh", authController.refresh);

export default router;
