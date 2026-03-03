import jwt from 'jsonwebtoken'
import { env } from '../config/env_config'
export const generateAccessToken=(userId:string)=>{
return jwt.sign(userId,env.jwt_access_secret||'rubul')

}
export const generateRefreshToken=(userId:string)=>{
return jwt.sign(userId,env.jwt_refresh_secret||'rubul')
}