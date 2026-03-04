import jwt,{JwtPayload} from 'jsonwebtoken'
import {Request,Response,NextFunction} from 'express'
import { env } from '../config/env_config'

interface jwtcustomPayload extends JwtPayload {
  userId:string
}
 const authorizationMiddleware=(req:Request,res:Response,next:NextFunction)=>{
  try{
      const authorizationHeader=req.headers.authorization
      if(!authorizationHeader||!authorizationHeader.startsWith('Bearer ')){
        return res.status(401).json("no authentication header found")
      }
      const token=authorizationHeader.split(" ")[1]
      const decode=jwt.verify(token,env.jwt_access_secret) as jwtcustomPayload
        req.user=decode.userId
        next()
        } catch (e: unknown) {
  if(e&& typeof e === "object"&& "name" in e && (e as unknown)==='TokenExpiredError'){
    return  res.status(401).json({message:"token expired"})
  }
return res.status(401).json({message:"invalid token"})
  }
}
export default authorizationMiddleware