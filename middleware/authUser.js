import jwt from "jsonwebtoken";

export const authUser = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.json({
            success: false,
            message: "Youre not Authorized!"
        })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

        if(decodedToken){
            req.user = {id: decodedToken.Id}
        }else{
            res.json({
            success: false,
            message: "You're not Authorized User"
        })}

        next();

    } catch (error) {
        res.json({
            success: false,
            message: "Youre not Authorized!"
        })
    }
}