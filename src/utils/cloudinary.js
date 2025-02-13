import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if (!localFilePath) return null // If localFilePath is null, it returns early to avoid errors.

        // upload the file on cloudinary
        const responce =  await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto" //  Automatically detects file type (image, video, etc.).
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary",responce.url)
        return responce;
        
    } 
    catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload get failded
        console.error("Cloudinary upload error:", error); // ✅ Handle errors
        return null;
    }
}

export default uploadOnCloudinary;
