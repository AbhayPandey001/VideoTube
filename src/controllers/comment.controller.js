import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, 'Not a valid videoid')
    }

   const comments = Comment.aggregate([
    {
        $match: {
            video: new mongoose.Types.ObjectId(videoId)
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerDetails"
        }
    },
    {
        $unwind: "$ownerDetails"
    },
    {
        $project: {
            content: 1,
            createdAt: 1,
            owner: {
                username: "$ownerDetails.username",
                avatar: "$ownerDetails.avatar"
            }
        }
    },
    {
        $sort: { createdAt: -1 }
    }
])

    const options = {
        page: parseInt(page) ,
        limit: parseInt(limit) 
    } 

    const result = await Comment.aggregatePaginate(comments, options)

    if (result.docs.length === 0) {
        throw new ApiError(404, "Error while fetching comments")
    }

    return res.status(200).json(new ApiResponse(200, result, "Comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, 'Not a valid videoid')
    }

    // Taking in the comment 
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, 'Comment can not be empty')
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })


    return res
        .status(200)
        .json(new ApiResponse(200, comment, 'Comment added succesfully'))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params

    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(400, 'Invalid commentId')
    }

    const { content } = req.body

    if (!content || content.trim() === "") {
        throw new ApiError(400, 'Comment can not be empty')
    }

    //finding the comment and updating 
    const comment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner: req.user._id
        },
        {
            $set: {
                content
            }
        },
        { new: true }
    )

    if (!comment) {
        throw new ApiError(404, "Comment not found or you are not authorized")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, 'Comment updated succesfully'))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params

    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(400, 'Invalid commentId')
    }

    const comment = await Comment.findOneAndDelete(
        {
            _id: commentId,
            owner: req.user._id
        }
    )

    if (!comment) {
        throw new ApiError(404, "Comment not found or you are not authorized")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, 'Comment deleted succesfully'))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}