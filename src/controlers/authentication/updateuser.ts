import {Request,Response} from 'express'
import { ApiError } from '../../middleware/errorHandler'
import logger from '../../utils/logger'
import { updateUserSchema } from '../../utils/validatons/userValidation'
import { prisma } from '../../db/prisma'
const updateUser=async(req:Request,res:Response)=>{
logger.info("hit update user")
    try{
    const validationResult=await updateUserSchema.safeParse(req.body)
    if(validationResult.error){
        return res.status(400).json({message:'validation error',error:validationResult.error.message})
    }
    console.log(validationResult.data)
    try{
        const user=await prisma.user.update({where:{id:req.user},data:validationResult.data})
        res.status(200).json({message:"updated successfully",data:user,})
        logger.info("updated user",user)
    }catch{
        return res.status(402).json({message:'not authorized'})
    }

}catch(e){
    logger.error("error while updating user",e)
    throw new ApiError("internal server error",500)
}
}
export default updateUser