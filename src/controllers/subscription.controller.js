import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    const { channelId } = req.params

    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel id')
    }

    const channel = await User.findById(channelId)

    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    // Checking that the user does not subscribes to themselves
    if (channelId === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself")
    }

    // checking if there is already a subscription
    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id
    })

    if (existingSubscription) {
        const removedSubscription = await Subscription.findByIdAndDelete(existingSubscription._id)
        return res
            .status(200)
            .json(new ApiResponse(200, removedSubscription, 'Unsubscribed from this channel'))
    } else {
        const addSubscription = await Subscription.create({
            channel: channelId,
            subscriber: req.user._id
        })

        return res
            .status(200)
            .json(new ApiResponse(200, addSubscription, 'Subscribed to this channel'))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}