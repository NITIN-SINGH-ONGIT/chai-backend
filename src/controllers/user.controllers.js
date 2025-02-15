import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async(userId) => {
    try {
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       // how to add refresh token to databse so dont need to ask credential again and again
       user.refreshToken = refreshToken
       await user.save({validateBeforeSave : false}) // to save refreshToken to database // it help to avoid validation used in userschema validateBeforeSave : false
       
       return {accessToken,refreshToken}
    } 
    catch (error) {
      throw new ApiError(500,"something went wrong while generating token")  
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;
    // console.log("email:", email);

    // Validate empty fields
    if ([fullName, email, username, password].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }
    
    // console.log(req.files);                  

    // Handle avatar upload
    const avatarLocalPath = req.files?.avatar?.[0]?.path || null;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null; // FIXED

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    let coverImage = null;
    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    // Create user
    const user = await User.create({  // ADDED `await`
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // Fetch user without password & refreshToken
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler(async(req,res) => {
    const {email,username,password} = req.body
    if (!username || !email) {
        throw new ApiError(400,"username or email is required")
    }
    // if first entry get find in database findOne return it 
    const user = await User.findOne({
        $or : [{username},{email}]
    })

    if (!user) {
        throw new ApiError(400,"User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password) // password come from req.body
    if (!isPasswordValid) {
        throw new ApiError(401,"Password is incorrect")
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select(" -password -refreshToken")

    // send cookies
    const options = {
        httpOnly : true,
        secure : true
    }    
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,{
                user : loggedInUser,accessToken,refreshToken
            },"User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set : {
            refreshToken : undefined
        }
      },
      {
        new : true
      }
    )

    const options = {
        httpOnly : true,
        secure : true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200),{},"user logged out successfully")
})

export { registerUser,loginUser,logoutUser };



/*
loginUser 
 //req body -> data
 //username or email
 // find the user
 // password check
 // access and refresh token
 // send cookie 
*/


/* // get user details from frontend  == registerUser
 // validation -not empty
 // check if user already exists : username , email
 // check for images,check for avatar
 // upload them to cloudnairy, avatar
 // create user object - create entry in db
 // remove password and refresh token field from responce // beacuse all responce come as it is from db
 // check for user creation 
 // return res */

