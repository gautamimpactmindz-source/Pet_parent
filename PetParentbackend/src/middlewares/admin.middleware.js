export const adminOnly=async(req,res,next)=>{
    const role=req.user.role;


    if(role!=='admin'){
        return res.status(403).json({
            message:'Only admin access allowed'
        })
    }
    next();
}