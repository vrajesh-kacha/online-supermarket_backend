import jwt from "jsonwebtoken";

export const verifyToken = (req,res,next) => {
try {

    if (!req.headers.authorization) {
        return res.status(400).json({ success: false, message: "please provide token!" });
    }
    const token = req.headers["authorization"];
    const verifyToken =jwt.verify(token,process.env.JWT_SECRET)
    if(!verifyToken){
        return res.status(400).json({ 
            success:false,
            message: 'you are logout Please login!' 
        });
    }
    req.user=verifyToken;
    next();
    
} catch (error) {
return res.status(400).json(
{
     success:false,
     message: "token is expired"
}
);

}  
}