import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist
    const { name, description } = req.body

    if (!name || !description || name.trim() === "" || description.trim() === "") {
        throw new ApiError(400, 'Name or description can not be empty')
    }

    const existingPlaylistName = await Playlist.findOne({
        name,
        owner: req.user._id
    })

    if (existingPlaylistName) {
        throw new ApiError(400, 'Playlist with this name already exists')
    }

    const newPlaylist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(new ApiResponse(201, newPlaylist, 'Playlist created Successfully'))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    const { userId } = req.params

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid userId')
    }

    const playlists = Playlist.aggregate([
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
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                totalVideos: 1,
                createdAt: 1
            }
        }
    ])

    const options = {
        page: 1,
        limit: 10
    }

    const userPlaylists = await Playlist.aggregatePaginate(playlists, options)

    return res
        .status(200)
        .json(new ApiResponse(200, userPlaylists, 'Playlists fetched Successfully'))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id
    const { playlistId } = req.params

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid playlist')
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, 'Playlist fetched succesfully'))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid playlist')
    }

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid Video')
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, 'Video not found')
    }

    //insertion of video into playlist
    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user?._id
        },
        {
            $addToSet: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, 'Successfully added video to playlist'))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // TODO: remove video from playlist
    const { playlistId, videoId } = req.params

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid playlist')
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid Video')
    }


    // deletion of video from the playlist

    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $pull: { videos: videoId }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, 'Successfully removed video from playlist'))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist
    const { playlistId } = req.params

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid playlist')
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found ')
    }

    // Authorization check
    if (!req.user?._id.equals(playlist.owner)) {
        throw new ApiError(403, 'Not authorized to delete this playlist');
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Deleted playlist successfully'))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    //TODO: update playlist
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid playlist')
    }
    if (!name || name.trim() === "") {
        throw new ApiError(400, "Name is required")
    }

    const updateDetails = {
        name: name.trim()
    }
    //so that if no description is recieved, previous description isn't overwritten
    if (description !== undefined) {
        updateDetails.description = description.trim()
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $set: updateDetails
        },
        { new: true }
    )

    if (!playlist) {
        throw new ApiError(404, 'Playlist not found ')
    }
    return res
        .status(200)
        .json(new ApiResponse(200, playlist, 'Updated playlist successfully'))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}