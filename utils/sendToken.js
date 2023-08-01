export const sendToken = (res, user, message, statusCode=200) =>{
    const token = user.getJWTToken();
    const options = {
        expires: new Date(Date.now()+15*24*60*60*1000),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
    }
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        message,
        user,
    })
}