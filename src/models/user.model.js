import mongoose , {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const userSchema =  new Schema({
    username : {
        type : String , 
        required : true , 
        unique : true, 
        lowercase : true ,
        trim : true  ,
        index : true    // fast searching ke liye index banate hain.
    } , 
    email : {
        type : String , 
        required : true , 
        unique : true, 
        lowercase : true ,
        trim : true  
    } ,
    fullName : {
        type : String , 
        required : true , 
        trim : true  ,
        index : true
    } ,
    avatar : { 
        type : String , // from cloudinary url 
        required : true 
    } ,
    coverImage : {
        type : String , // from cloudinary url       
    } ,
    watchHistory : {
        type : Schema.Types.ObjectId , 
        ref : "Video"
    } , 
    password : {
        type : String ,
        required : [true, 'Password is a required field']
    } ,
    refreshToken : {
        type : String
    }
} ,
{
    timestamps : true
}
)

userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return ;
    
    this.password =  await bcrypt.hash(this.password , 10) //10 is the no of repetitions/rounds/salts(koi v value de sakte hain)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function () { //async not needed as it is fast
     return jwt.sign(
        {
            _id : this._id ,
            email : this.email ,
            username : this.username ,
            fullName : this.fullName 
        } ,
        process.env.ACCESS_TOKEN_SECRET ,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () { //async not needed as it is fast
     return jwt.sign(
        {
            _id : this._id , 
        } ,
        process.env.REFRESH_TOKEN_SECRET ,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User" , userSchema)