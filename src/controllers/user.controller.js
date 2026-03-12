import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import { ref } from 'process';
import { create } from 'domain';
import { log } from 'console';

const generateAccessAndRefreshTokens = async (userid) => {
  try {
    //find kro user pehle toh
    const user = await User.findById(userid);

    // generate ke liye method banaye the user model mein
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // ref token ko db mein daalna hai
    // jo user mila hai uper , uske schema mein already ref token field defined thi , so
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //save in mongo db , koi v other required field(like password) ko validate nahi karta and sidha save kar deta hai.

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating access and refresh token'
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // getting user details
  const { fullName, email, username, password } = req.body;
  // console.log("email yeh hai kya :" , email);
  // file handling ke liye user routes mein multer middle ware daal diye inside router .route
  // Validation
  if (
    [fullName, email, username, password].some((field) => field?.trim() === '') // agar inme se koi trim karne ke baad v empty hai toh yeh karo :
  ) {
    throw new ApiError(400, 'All fields are required');
  } // import krlo apierror

  // Checking if user already exists  -> iske liye schema se User ko import karna pdega
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  }); // ya toh email mil jaye ya username uske liye $ likhe hain and or lagaye hain

  if (existedUser) {
    throw new ApiError(409, 'The user with email or username already exists');
  }

  // checking images
  const avatarLocalPath = req.files?.avatar[0]?.path; //user routes mein yahi naam tha {read it like : req ke andr files mein avatar naam ki file ka path}
  // path wali chiz [0] pe milti hai isliye waise likhe
  // Check karlo aaya ki nahi
  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is required');
  }

  // avatar ke liye toh wahin pe check kar rahe lekin coverImage ke liye check nahi h isliye usko aise likhege :
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // uploading to cloudinary ---> direct fn bna hua hai , import and use
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // checking image finally gyi ki nahi
  if (!avatar) {
    throw new ApiError(400, 'Avatar file is required{cloudinary wala}');
  }

  // DB mein entry karo
  const user = await User.create({
    fullName,
    avatar: avatar.url, // as avatar ek reponse return kar raha usme se url nikal ke db mein store karege
    coverImage: coverImage?.url || '', // agar ho toh url lelo nahi toh empty rehne do
    email,
    password,
    username: username.toLowerCase(),
  });

  // check ki user successfully create hua ya nahi
  // mongo db har ek entry ki _id store karta hai
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken' // - mtlb to exclude these
  ); // ab user to aayega bas ye do fields nahi aayege

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }
  // sab hogya toh response bhejdo
  // apiresponse banaye the usko structure dene ke liye , import and use
  return res.status(201).json(
    new ApiResponse(200, createdUser, 'User registered succesfully<<<') //from constructor of that class
  );
});

// Login feature (notes_12.md mein hai)

const loginUser = asyncHandler(async (req, res) => {
  // data lelo
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, 'Username or email is required');
  }

  // find karo user ko using findOne method (sabse pehla matching document deta hai)
  const user = await User.findOne({
    //[dhyan rakho ki ye is moment ka update h , agar db update hota h toh firse user lagega yeh wala is moment ka instance h throughout the fn]
    $or: [{ username }, { email }], // ya toh username ya email ke basis pe find kardo
  });
  //agar mila hi nahi toh
  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  // check password
  const isPasswordValid = await user.isPasswordCorrect(password); // bcrypt hai await lagega
  // agar false aaya
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials ');
  }

  // created a separate method for tokens on top , now
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  // the user object inside loginUser was fetched before the database update, and Mongoose does NOT auto-sync in-memory documents with DB changes.
  // do tarike h ya to manually update krdo ya ek aur db query maar do (done here)
  // dono ka  access mil gya send to cookies bas password and ref token chupa ke bhejna hai , unwanted field hai
  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  // sending cookies , kc security option bana ke fir cookie send karege
  const options = {
    httpOnly: true,
    secure: true,
    // aisa karne se server hi modify kar payega sirf cookies ko and not the frontend as cookies could be modified in frontend
  };
  return res
    .status(200)
    .cookie('accessToken', accessToken, options) //cookie send , name fir kya bhejna hai and then options
    .cookie('refreshToken', refreshToken, options)
    .json(
      // if mobile app pe ho user , wahan cookies nahi hogi tb ke liye || user khud se tokens ko save krna chahe for some reason
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'User logged in successfully'
      )
    );
});

// logout feature
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id, //-------> to find the user first
    {
      //-------> then what to update
      $unset: {
        //oprator h unset
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true, // return mein jo response milega usme new updated value milegi (undefined wala yeh)
    }
  ); // ye method sidha update kr deta hai find krke wapas se user save and validate before false nahi krna pdega

  const options = {
    httpOnly: true,
    secure: true,
    // aisa karne se server hi modify kar payega sirf cookies ko and not the frontend as cookies could be modified in frontend
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, 'User logged out'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // ref token toh lagega pehle tab toh usko refresh karwayege
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'unauthorized request');
  }

  //verify kro aaye hue token ko and decode kro (is file mein jwt import krlo pehle)
  try {
    const decodedToken = jwt.verify(
      // note that jwt.sign kiye the refreshtokengenerator mein and uske andr _id pass kiye the so ab decode hone ke baad us _id ka access hooga hamare paas
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, 'Invalid  refresh token');
    }

    // match kro ki user ka token and db wala token same h ki nahi
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'Refresh token is  expired or used');
    }
    const options = {
      httpOnly: true,
      secure: true,
      // aisa karne se server hi modify kar payega sirf cookies ko and not the frontend as cookies could be modified in frontend
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, registerUser: newRefreshToken },
          'Access token refreshed'
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token');
  }
});

// notes 13
const changeCurrentPassword = asyncHandler(async (req, res) => {
  // logged in hai ki nai checking , etc ke liye toh middleware hai hi jwt wala
  const { oldPassword, newPassword } = req.body;
  // agr password change kr pa raha toh logged in hoga pakka and cookies hongi , ab waha se middleware laga ke req.user ka access lelenge and usse user mil jayega
  // finding the user and checking if the oldpass is correct
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword); // returns true or false

  if (!isPasswordCorrect) {
    throw new ApiError(400, 'Invalid old password');
  }

  // if pass correct proceed :
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'Current user fetched succesfully '));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, 'All fields are required');
  }

  // find kro us user ko (directly using find and update)

  const user = User.findByIdAndUpdate(
    req.user?._id, // jo find krna hai woh
    {
      // mongo db operator hai set
      $set: {
        fullName,
        email: email, //⛳⛳⭐🤣 // same as sirf akela email as in es6
      },
    },
    { new: true } // update hone ke baad wali information(updated information) return hoti hai aise krne se
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Account details updated successfully'));
});

// updating files

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path; // through multer middleware

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is missing');
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, 'Error while uploading on avatar');
  }
  // update
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url, // uper jo cloudinary ne bheja woh pura response hai usse url nikaalna pdega
      },
    },
    { new: true }
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Avatar image updated succesfully'));
});

// same code for coverImage
const updateUserAvatarCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path; // through multer middleware

  if (!coverImageLocalPath) {
    throw new ApiError(400, ' Cover image file is missing');
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, 'Error while uploading on avatar');
  }
  // update
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url, // uper jo cloudinary ne bheja woh pura response hai usse url nikaalna pdega
      },
    },
    { new: true }
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Cover image updated succesfully'));
});

// notes14
const getUserChannelProfile = asyncHandler(async (req, res) => {
  // url se username lenge
  const { username } = req.params;
  if (!username?.trim) {
    throw new ApiError(400, 'Username is missing');
  }

  // ab is username se user find kar sakte hain and then pipeline laga ke count etc
  // direct match field use kar sakte hain , woh sare doc se ek find kr lega

  const channel = await User.aggregate([
    // yeh User wahi usermodel hai (yaad aaya na , isi naam se export kiye hai user.model se ) , us user ke uper agg pipeline likhe hain yaha
    {
      $match: {
        username: username?.toLowerCase(), // kya compare krna hai : kisse(url wale username se) krna hai
      },
    },
    // ab ek document filter ho gya
    // example bana ke socho acche se smjh aayega , url mein ek channel mila say channel x , usi pe lookup kiye , us channel ka user se id liye and subsc se channel and dono ko match kiye
    {
      $lookup: {
        from: 'subscriptions', // model ko Subscription naam se liya tha but mongo db mein aise save hota hai (lowecase + plural) so yha aise hi dena pdta from means kaha se join karna hai
        localField: '_id',
        foreignField: 'channel',
        as: 'subscribers', // kis naam se ye record bnega (as ye record ban gaya aage se kahi v iska refrence $ laga ke lenge)
      },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localfield: '_id',
        foreignField: 'subscriber',
        as: 'subscribedTo',
        // ab ye sari fields ikkatha ho gayi hai ab unko count karna hai uske liye $size naam ka field hai
      },
    },
    {
      $addFields: {
        subscriberCount: { $size: '$subscribers' },
        channelSubscribedToCount: { $size: '$subscribedTo' }, // now jo already subscribe kiya hua hai uske liye subscribed dikhana hai so true false bhejege yha se frontend mein
        isSubscribed: {
          $cond: {
            //3 parameter leta hai ye condition , if  , then(if true) , else(false)
            if: { $in: [req.user?._id, '$subscribers.subscriber'] }, // subscribers wale doc mein yeh hai ki nahi ye check karna hai , agar logged in hain toh req.user hoga , in compare kar deta hai , also as $subscriber ek field object hai uske andr v ja sakte hain so $subscribers.subscriber , in ka mtlb present hai ki nahi
            then: true,
            else: false,
          }, // detail about the $if , $in line : jo user logged in hai , agar uska id , uper jo channel ke subs ki list thi usme match kar jaye toh true return karo
        },
      },
    }, // hamko ab selected chizein deni hai so project field use krege (projection)
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  // array deta hai aggregation pipeline uske andr object hota hai array ka first value imp hai hamare liye
  if (!channel?.length) {
    throw new ApiError(404, 'channel does not exist');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], 'user channel fetched successfully')
    ); //array ka first value imp hai hamare liye , woh obj hai
});

// notes15
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: 'videos',
        localField: 'watchHistory',
        foreignField: '_id',
        as: 'watchHistory',
        pipeline: [
          // this is nesting in lookup  , note now the context is from user to the new joined user.videos (uper jaha tak pahunche uske andr)
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
              pipeline: [
                {
                  $project: {
                    // pura user thodi set karna hai owner ke andr
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            // array mt return ho array[0] uske liye ek aur pipeline
            $addFields: {
              owner: {
                // same naam rakhe taaki overwrite ho jaye owner field
                $first: '$owner',
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        'Watch history fetched succesfully'
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserAvatarCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
