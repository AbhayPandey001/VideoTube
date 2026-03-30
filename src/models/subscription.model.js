import mongoose , {Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'


const subscriptionSchema = new Schema({
    // id toh khud hi aa jati hai
    subscriber : {
        type : Schema.Types.ObjectId , //one who is subscribing
        ref : "User"
    } ,
    channel : {
        type : Schema.Types.ObjectId , // jisko sub kiya gaya hai
        ref : "User"
    } 
},{timestamps : true} )


subscriptionSchema.plugin(mongooseAggregatePaginate)
export const Subscription =  mongoose.model("Subscription" , subscriptionSchema)