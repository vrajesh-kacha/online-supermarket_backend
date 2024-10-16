import  mongoose from "mongoose"

const connectiondb=()=>{
    mongoose.connect(process.env.CONNECTION)
       .then(() => console.log("MongoDB connected..."))
       .catch((err) => console.log(err));
}

export {connectiondb};