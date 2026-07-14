import jwt from 'jsonwebtoken';



export let Auth=async(req,res,next)=>{
    try {
        const authHeader=req.cookies.accessToken
        
        if(!authHeader){
            return res.status(401).json({message:'Unauthorized'})
        }
        const token =authHeader

        const decoded=jwt.verify(token,process.env.ACCESS_SECRET);
     

        req.user={
            id:decoded.id,
            role:decoded.role,
            name:decoded.name
        }

        next();
    } catch (err) {

  return res.status(401).json({
    message: err.message
  });
}
}

export let adminAuth=async(req,res,next)=>{
  
    try {
       
        const authHeader=req.cookies.adminaccessToken;
      
        if(!authHeader){
            return res.status(401).json({message:'Unauthorized'})
        }

        //    const token=authHeader.split(" ")[1];
        const token = authHeader

        const decoded=jwt.verify(token,process.env.ACCESS_SECRET);

        req.user={
            id:decoded.id,
            role:decoded.role,
            name:decoded.name
        }

        next();
    } catch (err) {

  return res.status(401).json({
    message: err.message
  });
}
}

