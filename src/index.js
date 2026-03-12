import dotenv from 'dotenv'
dotenv.config({path : './.env'})
import {app} from './app.js'

import connectDB from './db/index.js'

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`the server is running at port ${process.env.PORT}`); 
              
    })
})
.catch((err) => {
    console.log(`Mongo db connection failed : ${err}`);   
})



/*
// 🔽🔽🔽🔽The first method code :::::


import dotenv from 'dotenv'
dotenv.config({path : "./.env"})
import mongoose  from 'mongoose'
import {DB_NAME} from './constants.js'

import express from 'express'
const app = express()



(
 async () => {
    try{
        await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
        app.listen(process.env.PORT , () => {
            console.log(`The server is listening at the port ${process.env.PORT}`);
            
        })
    }catch(error) {
        console.error(`an error occurred ${error}`);
        throw error
    }
 }
)()
 */