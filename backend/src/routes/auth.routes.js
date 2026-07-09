import {Router} from "express";
import {validateRegister, validateLogin} from "../validator/auth.validator.js";
import { register, login, googleCallback , getMe} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import passport from "passport";

const router = Router();

//@route POST /api/auth/register
//description: Register a new user
//access Public
//@route POST /api/auth/login
router.post('/register', validateRegister, register)

//@route POST /api/auth/login
//description: Login a user
//access Public
//@route GET /api/auth/google
router.post('/login', validateLogin, login)

//@route GET /api/auth/getMe
//description: Get user details
//access Private
//@route GET /api/auth/getMe
router.get('/getMe', authenticateUser, getMe)

//@route GET /api/auth/google
//description: Google OAuth login
//access Public
//@route GET /api/auth/google
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))


//@route GET /api/auth/google/callback
//description: Google OAuth callback
//access Public
//@route GET /api/auth/google/callback
router.get('/google/callback', passport.authenticate('google', {session: false , failureRedirect: 'http://localhost:3000/api/auth/login'}),
    googleCallback
)

export default router;