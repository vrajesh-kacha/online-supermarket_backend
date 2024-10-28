import {v2 as cloudinary} from 'cloudinary';
const uploadOnCloudinary=async(fileBuffer)=>{
    try {
        const result = await cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) throw new Error("Cloudinary upload failed");
            return result;
          }
        );
        result.end(fileBuffer);
    
        return result;
      } catch (error) {
        throw new Error(error.message);
      }

}

export {uploadOnCloudinary}