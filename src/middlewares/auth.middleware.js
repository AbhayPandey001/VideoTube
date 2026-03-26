import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler(async (req , _ , next) => {  // res kahi v use nahi hua toh uski jagah _ likh diye { standard practice }
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // ya toh req.cookies se aajayega ya mobile app me auth naam ke header se
        if(!token) {
            throw new ApiError(401 , "Unauthorized request")
        }
    
        // compare krke verify kro sahi hai ya nahi , user model me gen acc token ke andr id email etc liye the , usko decode karna pdta hai
        // jwt ko manually import kro
        // jiske paas token secret hoga wahi verify kar sakta hai isliye woh bhi dena pdta hai verify method ko
       const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
    //    ab decodedToken mein _id email and username fullname honge qki usermodel mein generateAccToken method mein yahi sab bheje the , toh id extract krlo
       const user = await User.findById(decodedToken?._id).select("-password -refreshToken") // db call so use await
    
       if(!user) {
        throw new ApiError(401 , "Invalid Access Token")
       }
    
       req.user = user // request object mein ek user naam ka field v add kar diye hain
       next()          // passes the execution further to other methods if available
    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid access token")
    }
})