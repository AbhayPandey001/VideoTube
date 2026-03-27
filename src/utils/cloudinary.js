import {v2 as cloudinary} from 'cloudinary'   //karna padta hai . from docs.
import fs from 'fs'
import { config } from 'dotenv';

config()
cloudinary.config({ 
        cloud_name: 'mainabhayhoon', 
        api_key: 719417936975164, 
        api_secret: 'ms49mfQ4RCJBOkK69Z2Uy2Aez7w' // Click 'View API Keys' above to copy your API secret (in cloudinary site)
    });


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        //uploading the file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath , {resource_type: "auto"}) //file type auto pe set kar diye , image , video etc v hota hai auto hata ke ctrl + space ya fir docs mein dekho. 
        //file has been uploaded succesfully
        console.log('file has been uploaded succesfully' ,response.url)
        fs.unlinkSync(localFilePath)
        return response
    } catch(error){
        fs.unlinkSync(localFilePath) //agar nahi ho payi upload toh cleaning ke liye usko hata diye hain.  
        return null
    }
}

export {uploadOnCloudinary}