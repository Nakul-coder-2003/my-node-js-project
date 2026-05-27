import jwt from "jsonwebtoken"

export const isAuthenticated = async(req,res,next) => {
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(400).json({message:"Please login to access this"})
        }

        const decodeData = jwt.verify(token,process.env.JWT_SCCERET)

        req.user = decodeData;

        next()
    } catch (error) {
        return res.status(401).json({message:"Invalid aur unexpected token!"})
    }
}