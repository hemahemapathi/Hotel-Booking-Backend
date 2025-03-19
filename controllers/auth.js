import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { createError } from "../utils/error.js"
import jwt from "jsonwebtoken"

export const register = async (req, res, next) => {
try{
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
    })

    await newUser.save()
    res.status(201).json({ message: "User has been created successfully", userId: newUser._id })
}catch(err){
    next(err);
}};

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return next(createError(400, "Username or email already exists"));
        }

        // Create new user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            email,
            password: hash,
        });

        await newUser.save();

        // Generate token
        const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT);

        res.status(201).json({
            message: "User has been created successfully",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try{
        const user = await User.findOne({username: req.body.username});
        if(!user) return next(createError(404, "User not found!"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password,user.password);
            if(!isPasswordCorrect) return next(createError(400, "Wrong password or username!"));
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT);

            const {password, isAdmin, ...otherDetails} = user._doc;
            res.cookie("access_token",token,{httpOnly: true,}).status(200).json({details:{...otherDetails}, isAdmin});
    }catch(err){
        next(err);
    }};