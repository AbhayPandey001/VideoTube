import { Router } from "express"
import { 
    changeCurrentPassword, 
    getCurrentUser, 
    getUserChannelProfile, 
    getWatchHistory, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserAvatarCoverImage 
} from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1            // kitni files leni hai
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//secured routes aise routes jo user ko dene hain jb user loggedin ho
// jab v koi controller tab activate karana hai jab user logged in ho uskeliye verifyJWT wala middle ware laga dena hai, 
// woh req.user bhi deta hai
router.route("/logout").post(verifyJWT, logoutUser) // verify wale middleware mein next likhe the taaki verifyJWT ke baad apne aap logoutuser pe chale jaye
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser) //as sirf details de raha kuch data bhej nahi rahe isliye get
router.route("/update-account").patch(verifyJWT, updateAccountDetails) // taki sari details update mt ho , so patch
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserAvatarCoverImage)

// params wala : 
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHistory)

export default router