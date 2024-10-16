import mongoose from "mongoose";
const userSchema=mongoose.Schema(
{
username:{
    type:String,
    default:null
},
email:{
    type:String,
    default:null
},
password:{
    type:String,
    default:null
},
phone:
{
    type:String,
    default:null
}
,role:{
    type:String,
    default:"user"
 },
 cart: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "products",
    default: []
}
}
)
export default mongoose.model("users",userSchema)