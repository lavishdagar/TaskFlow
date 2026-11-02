import passport from 'passport';
import "dotenv/config";
import pkg from "passport-local";
import User from './models/User.js';
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from 'bcryptjs'
console.log("JWT Secret loaded:", Boolean(process.env.JWTSECRET));
const { Strategy: LocalStrategy } = pkg;
passport.use(
    new LocalStrategy({ usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
                if (!user || !await bcrypt.compare(password, user.passwordHash)) {
                    return done(null, false, { message: "Invalid Credentials" });
                }
                return done(null, user)
            } catch (err) {
                return done(err);
            }
        }
    )
)
const cookieExtractor = (req) => {
    return req?.cookies?.access_token || null;
}
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.JWTSECRET
        },
        async (payload, done) => {
            try {
                const user = await User.findById(payload.sub);
                return done(null, user || false)
            } catch (err) {
                return done(err, false);
            }
        }
    ))



export default passport;