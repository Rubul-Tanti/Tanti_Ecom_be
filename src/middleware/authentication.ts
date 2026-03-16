import jwt,{JwtPayload} from 'jsonwebtoken'
import {Request,Response,NextFunction} from 'express'
import { env } from '../config/env_config'
import { prisma } from '../db/prisma'
import { getsafeUser } from '../controlers/authentication/loginUser'
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken'

interface jwtcustomPayload extends JwtPayload {
  userId:string
}
 const authorizationMiddleware=async(req:Request,res:Response,next:NextFunction)=>{
  try{
         if(req.originalUrl.startsWith('/api/user/login')){
          if(req.body?.email){
            return next()
          }
         const authorizationHeader=req.headers.authorization
      if(!authorizationHeader||!authorizationHeader.startsWith('Bearer ')){
       return  next()}}

      const authorizationHeader=req.headers.authorization
      console.log(authorizationHeader)
      if(!authorizationHeader||!authorizationHeader.startsWith('Bearer ')){
        return res.status(401).json("no authentication header found")
      }
      const token=authorizationHeader.split(" ")[1]

      const decode=jwt.verify(token,env.jwt_access_secret) as jwtcustomPayload
      const user=await prisma.user.findUnique({where:{publicId:decode.userId}})
      if(!user){
        return res.status(401).json({message:'user not found'})
      }
      if(req.originalUrl.startsWith('/api/user/login')){
        const access_token=generateAccessToken(user.publicId)
        const refresh_token=generateRefreshToken(user.publicId)
        return res.status(200).cookie("refresh_token",refresh_token,{httpOnly:true,secure:true}).json({message:'login successfully',data:getsafeUser(user),access_token})
      }

      req.user=user;
        next()
        } catch (e: unknown) {
  if(e&& typeof e === "object"&& "name" in e && (e as unknown)==='TokenExpiredError'){
    return  res.status(401).json({message:"token expired"})
  }
return res.status(401).json({message:"invalid token"})
  }
}
export default authorizationMiddleware