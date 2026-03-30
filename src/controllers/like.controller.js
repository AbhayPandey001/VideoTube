import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    const { videoId } = req.params

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, 'Not a valid videoid')
    }

    // Check if video exists
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, 'Video Unliked Successfully'))
    } else {
        const like = await Like.create({
            video: videoId,
            likedBy: req.user._id
        })

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: true, like }, 'Video Liked Successfully'))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    const { commentId } = req.params

    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(400, 'Not a valid Commentid')
    }

    // Check if comment exists
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, 'Comment Unliked Successfully'))
    } else {
        const like = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: true, like }, 'Comment Liked Successfully'))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    const { tweetId } = req.params
    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, 'Invalid tweetId')
    }

    // Check if Tweet exists
    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, 'Tweet Unliked Successfully'))
    } else {
        const like = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: true, like }, 'Tweet Liked Successfully'))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const channelId = req.user._id

    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel id')
    }

    const likedvideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        {
            $unwind: "$videoDetails"
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                videoDetails: 1
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, likedvideos, 'Liked videos fetched successfully'))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}