import {Request,Response} from 'express'
import { ApiError } from '../../middleware/errorHandler'
import { prisma } from '../../db/prisma'
import logger from '../../utils/logger'
export const getAllProduct=async(req:Request,res:Response)=>{
try{
const role = req.user?.role
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return res.status(403).json({ message: "not authorized" })
    }
const products=await prisma.product.findMany()
res.status(200).json({
    success:true,
    message:'products fetched successfully',
    data:products
})
}catch(e){
    logger.error("error while fetching products",e)
    throw new ApiError('error while fetching products',500)
}
}