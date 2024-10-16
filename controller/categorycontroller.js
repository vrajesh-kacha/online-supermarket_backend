import categoryModel from '../models/categoryModel.js'

export const createCategoryController=async(req,res)=>{
    try {
        const duplicatecetegory= await categoryModel.find({name:req.body.name})
        if(duplicatecetegory.length!==0){
    
            return res.status(401).json(
            {success:false,
                message:"category already exist",
            }
        )

}

        const createdcategory=await categoryModel.create(req.body)
        return res.status(200).json({
            
            success:true,
            message:"category created succesfully!",
            createdcategory
        })
        
    } 
    catch (error) {
    return res.staus(500).json({
        success:false, 
        message:"Error in created category",
        error

})        
    }      

}

export const updateCategoryController=async(req,res)=>{
    try {
        const {name}=req.body
        const {id}=req.params
        const category= await categoryModel.findByIdAndUpdate(id,{"name":name},{"new":true})
        
        return res.status(200).json(
            {
                success:true,
                message:"category updated succesfully!", 
                category
            }
        )  
    } 
    catch (error) {
    return res.staus(500).json({
        success:false, 
        message:"Error in update category",
        error

})        
    }      

}


export const getCategoryController=async(req,res)=>{
    try {
        const category= await categoryModel.find()
        return res.status(200).json(
            {
                success:true,
                message:"category get succesfully!", 
                category
            }
        )  
    } 
    catch (error) {
    return res.status(500).json({
        success:false, 
        message:"Error in get category",
        error

})        
    }      
}
export const deleteCategoryController=async(req,res)=>{
    try {
        const {id}=req.params
        const category= await categoryModel.deleteOne({"_id":id})
        
        return res.status(200).json(
            {
                success:true,
                message:"category deleted succesfully!", 
                category
            }
        )  
    } 
    catch (error) {
    return res.status(500).json({
        success:false, 
        message:"Error in delete category",
        error

})        
    }      

}