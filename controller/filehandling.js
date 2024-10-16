import {v2 as cloudinary} from 'cloudinary';
const uploadOnCloudinary=async(localFilePath)=>{

try {
    if(!localFilePath){
        throw new Error('Local file path is required.');
    }
    const response=await cloudinary.uploader.upload(localFilePath,{
        resource_type:'image',
        transformation:[
            {width:300, height:300, crop:'fit'}
        ]
    })
     return response
}
 catch (error) {
  return null;
}

}

export {uploadOnCloudinary}