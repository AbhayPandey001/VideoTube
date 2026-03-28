import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    //TODO: get all videos based on query, sort, pagination
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid userid')
    }

    const matchStage = {
        owner: new mongoose.Types.ObjectId(userId),
        isPublished: true
    }

    if (query) {
        matchStage.title = { $regex: query, $options: "i" }
    }

    const sortStage = {}

    if (sortBy) {
        sortStage[sortBy] = sortType === "asc" ? 1 : -1
    } else {
        sortStage.createdAt = -1
    }

    const videos = Video.aggregate([
        {
            $match: matchStage
        },
        {
            $sort: sortStage
        },
        {
            $project: {
                _id: 1,
                title: 1,
                thumbnail: 1,
                views: 1,
                createdAt: 1
            }
        }
    ])

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const paginatedVideos = await Video.aggregatePaginate(videos, options)

    return res.status(200).json(
        new ApiResponse(200, paginatedVideos, "Videos fetched successfully")
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    // my plan : 
    // Take title and descrption from rq.body 
    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, 'Video title and description is required')
    }

    // Taking video and image files
    const thumbnailLocalFilePath = req.files?.thumbnail?.[0]?.path
    const videoFileLocalpath = req.files?.videoFile?.[0]?.path

    if (!thumbnailLocalFilePath || !videoFileLocalpath) {
        throw new ApiError(400, 'Video File and Thumbnail is required to publish a video')
    }

    //uploading the file to cloudinary
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalFilePath)
    const uploadedVideoFile = await uploadOnCloudinary(videoFileLocalpath)

    if (!uploadedThumbnail || !uploadedVideoFile) {
        throw new ApiError(500, 'Video File and thumbnail could not be uploaded , internal server error ')
    }

    const video = await Video.create({
        videoFile: uploadedVideoFile.url,
        thumbnail: uploadedThumbnail.url,
        title,
        description,
        duration: uploadedVideoFile.duration,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(new ApiResponse(201, video, 'Video published successfully'))
})

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, 'Video not found')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, 'video fetched successfully'))
})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail

    //actual upload start
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // taking in the uploaded file that will replace earlier one
    const updatedThumbnail = req.file?.path

    if (!updatedThumbnail) {
        throw new ApiError(400, 'No thumbnail recieved')
    }

    //uploading the file
    const thumbFile = await uploadOnCloudinary(updatedThumbnail)

    if (!thumbFile) {
        throw new ApiError(500, 'Inernal server error , file could not be upadated')
    }

    // Taking in title and description 
    const { title, description } = req.body

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, 'video not found')
    }

    //checking if the owner of video is uploading 
    if (req.user._id.toString() !== video.owner.toString()) {
        throw new ApiError(403, "Unauthorized request");
    }

    video.title = title || video.title
    video.description = description || video.description
    video.thumbnail = thumbFile.url

    await video.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, video, 'Thumbnail updated succesfully'))

})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, 'Videoid is required')
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video id')
    }

    // Checking for the authority of the user to delete their video only
    const video = await Video.findOneAndDelete({
        _id: videoId,
        owner: req.user._id
    })

    if (!video) {
        throw new ApiError(404, 'video not foundor Forbidden request')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, 'Video deleted succesfully'))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, 'Videoid is required')
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video id')
    }

    // Checking for the authority of the user to publish their video only
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, 'video not found')
    }

    if (req.user._id.toString() !== video.owner.toString()) {
        throw new ApiError(403, 'Unauthorized request')
    }

    video.isPublished = !video.isPublished
    await video.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, video, 'Video Succesfully Published / unpublished'))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}