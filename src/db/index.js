import mongoose from 'mongoose'
import {DB_NAME} from '../constants.js'

const connectDB =  async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
        console.log("The database is connected");     
        // console.log(connectionInstance);
          
        console.log(`Yah rahi host connection wali line : ${connectionInstance.connection.host}`); 
        
    } catch (error){
        console.log(`Connection mein error hai !! : ${error}`);
        process.exit(1)
    }
}

export default connectDB