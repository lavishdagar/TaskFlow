import { Router } from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import passport from "../passport.js";
import cookieParser from "cookie-parser";


const router = Router();
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    samesite: "lax",
    maxAge: 60 * 60 * 1000,
    path: "/"
}

const setCookieAuth = (res, user) => {
    const token = jwt.sign(
        { sub: user._id.toString() },
        process.env.JWTSECRET,
        { expiresIn: "1h" }
    );

    res.cookie("access_token", token, cookieOptions)
}

const validateRegistration = [
    body("name").trim().notEmpty(),
    body("email").trim().normalizeEmail().isEmail(),
    body("password").isLength({ min: 6, max: 16 })
];



const publicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email
});

// REGISTER
router.post("/register", validateRegistration, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            passwordHash
        });
        setCookieAuth(res, user);

        res.status(201).json({
            user: publicUser(user)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Registration failed"
        });
    }
});

// LOGIN
router.post("/login", (req, res, next) => {
    passport.authenticate(
        "local",
        { session: false },
        (err, user, info) => {
            if (err) return next(err);

            if (!user) {
                return res.status(401).json({
                    message: info?.message || "Invalid credentials"
                });
            }

            setCookieAuth(res, user)

            return res.json({

                user: publicUser(user)
            });
        }
    )(req, res, next);
});
//logout
router.post("/logout", (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });

    res.json({
        message: "Logged out successfully"
    });
});

// CURRENT USER
router.get(
    "/me",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json({
            user: publicUser(req.user)
        });
    }
);

export default router;