import { findUserById } from "../services/user.js";
import jwt from "jsonwebtoken";

export const privateRoute = async (req , res , next) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({error: 'Unauthorized... No Token'});
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(process.env.JWT_SECRET_KEY);

        if(!decodedToken){
            return res.status(401).json({error: 'Unauthorized... Invalid Token'});
        
        }

        const findUser= await findUserById(decodedToken.userId);
        if (!findUser){
            return res.status(401).json({error: 'user not found'});

        }
        req.user = findUser;
        next();
    }catch(e){
        console.log(e)
        return res.status(401).json({ error: "Internal server error..." });
    }
};