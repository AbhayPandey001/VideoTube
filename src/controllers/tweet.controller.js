import mongoose, { isValidObjectId, Mongoose } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body

    // validation 
    if (!content || content.trim() === "") {
        throw new ApiError(400, 'Content can not be empty')
    }

    // creation 
    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(new ApiResponse(201, tweet, 'Tweet created succesfully'))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, ' Invalid user id ')
    }

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404 , 'User not found')
    }

    // aggregation pipeline
    const tweet =  Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                content : 1
            }
        }
    ])

    if (!tweet.length) {
        throw new ApiError(404, 'No tweets found')
    }

    // pagination 
    const options = {
        page: 1,
        limit: 10,
    };

    const paginatedUserTweets = await Tweet.aggregatePaginate(tweet , options)

    if(!paginatedUserTweets){
    throw new ApiError(500,"Couldn't fetch tweets.Try again.")
}

    return res
        .status(200)
        .json(
            new ApiResponse(200, paginatedUserTweets, 'user tweets fetched successfully')
        );
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, ' Invalid tweet id ')
    }

    const { newContent } = req.body

    if (!newContent || newContent.trim() === "") {
        throw new ApiError(400, 'Content can not be empty')
    }

    const updatedTweet = await Tweet.findOneAndUpdate(
        {
            _id: tweetId,
            owner: req.user._id
        },
        {
            $set: {
                content: newContent
            }
        },
        { new: true }
    )

    if (!updatedTweet) {
        throw new ApiError(404, "Tweet not found or unauthorized")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, 'Tweet succesfully updated'))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, 'Invalid tweet id')
    }

    const deletedTweet = await Tweet.findOneAndDelete(
        {
            _id: tweetId,
            owner: req.user._id
        }
    )

    if (!deletedTweet) {
        throw new ApiError(404, "Tweet not found or unauthorized")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedTweet, 'Tweet succesfully deleted'))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}