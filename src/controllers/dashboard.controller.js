import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.user._id

    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel id')
    }

    const totalChannelViews = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ])

    const totalViews = totalChannelViews[0]?.totalViews || 0

    // counting of subscribers
    const channelSubscribers = await Subscription.countDocuments({ channel: channelId })

    // counting total videos
    const totalChannelVideos = await Video.countDocuments({ owner: channelId })

    // counting total likes
    const totalChannelLikes = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: 'likedVideoDetails'
            }
        },
        {
            $unwind: "$likedVideoDetails"
        },
        {
            $match: {
                "$likedVideoDetails.owner": new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $count: "totalLikes"
        }
    ])

    const totalLikes = totalChannelLikes[0]?.totalLikes || 0

    const stats = {
        totalViews ,
        totalSubscribers : channelSubscribers , 
        totalVideos : totalChannelVideos ,
        totalLikes
    }

    return res 
        .status(200)
        .json( new ApiResponse(200 , stats , 'Channel Stats fetched succesfully'))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelId = req.user._id

    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel id')
    }

    const userVideos = await Video
        .find({ owner: channelId })
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, userVideos, 'Videos Fetched Successfully'))
})

export {
    getChannelStats,
    getChannelVideos
}