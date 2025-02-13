// Import necessary dependencies
import mongoose, { Schema } from "mongoose"; // Mongoose for MongoDB interaction
import jwt from "jsonwebtoken"; // JSON Web Token (JWT) for authentication
import bcrypt from "bcrypt"; // Bcrypt for password hashing

// Define the User schema (structure of the User document in MongoDB)
const userSchema = new Schema({
    // Username field (Unique and Indexed for fast search)
    username: {
        type: String, // Data type: String
        required: true, // Mandatory field
        unique: true, // Ensures each username is unique
        lowercase: true, // Converts the username to lowercase before saving
        trim: true, // Removes spaces before and after the username
        index: true // Improves search efficiency for querying users
    },

    // Email field (Must be unique)
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate emails
        lowercase: true, // Converts to lowercase for consistency
        trim: true, // Removes unnecessary spaces
    },

    // Full name field
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true // Helps in searching users by their full name
    },

    // Avatar (Profile Picture) - Stored as a Cloudinary URL
    avatar: {
        type: String, // Cloudinary URL of the user's avatar
        required: true, // User must have an avatar
    },

    // Cover Image (Optional) - Also stored as a Cloudinary URL
    coverImage: {
        type: String, // Cloudinary URL of the user's cover image
    },

    // Watch history - Stores references to Video documents
    watchHistory: [
        {
            type: Schema.Types.ObjectId, // Stores ObjectId of videos
            ref: "Video" // Links to the "Video" collection
        }
    ],

    // Password field (Hashed before storing)
    password: {
        type: String,
        required: [true, 'Password is required'], // Error message if password is missing
    },

    // Refresh token (Used for generating new access tokens)
    refreshToken: {
        type: String // Stores refresh token for authentication
    }

}, { timestamps: true }); // Enables automatic `createdAt` & `updatedAt` timestamps

// Pre-save middleware to hash the password before storing it in the database
userSchema.pre("save", async function (next) {
    // Check if the password field is modified (to avoid re-hashing unnecessarily)
    if (!this.isModified("password")) return next();

    // Hash the password with bcrypt (using 10 salt rounds)
    this.password = await bcrypt.hash(this.password, 10);
    next(); // Move to the next middleware
});

// Method to check if a given password is correct (by comparing it with the hashed password)
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate an access token (JWT) for authentication
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id, // Include user ID
            email: this.email, // Include user email
            username: this.username, // Include username
            fullName: this.fullName // Include full name
        },
        process.env.ACCESS_TOKEN_SECRET, // Secret key to sign the token
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Token expiry time (e.g., "1h", "7d")
        }
    );
};

// Method to generate a refresh token (Used for getting a new access token)
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id, // Only store the user's ID in the refresh token
        },
        process.env.REFRESH_TOKEN_SECRET, // Secret key for signing refresh tokens
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY // Refresh token expiry time
        }
    );
};

// Create a User model based on the schema
export const User = mongoose.model("User", userSchema); 
