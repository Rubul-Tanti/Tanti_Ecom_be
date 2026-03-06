import {Request,Response} from 'express'
import { ApiError } from '../../middleware/errorHandler'
import logger from '../../utils/logger'
import { prisma } from '../../db/prisma'
import { createProductSchema } from '../../utils/validatons/productValidation'
import { Product } from '../../generated/prisma/client'

export const getSafeProduct = (product: Product) => {
  return {
    id: product.slug,
    name: product.name,
    description: product.description,
    moreAboutProduct: product.moreAboutProduct,
    price: product.price,
    discountPercentage: product.discountPercentage,
    discountPrice: product.discountPrice,
    sizes: product.sizes,
    colors: product.colors,
    refundable: product.refundable,
    returnable: product.returnable,
    returnWindowDays: product.returnWindowDays,
    stockToDisplay: product.stockToDisplay,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    createdAt: product.createdAt
  }
}
export const createProduct=async(req:Request,res:Response)=>{
try{
    const role=req.user?.role
    if(role==='USER'){
        return res.status(403).json({message:"not authorized"})
    }
    const validationResult=createProductSchema.safeParse(req.body)
    if(!validationResult.success){
        return res.status(400).json({message:"validation error",error:validationResult.error.flatten()})
    }
    const data=validationResult.data
    const product=await prisma.product.create({data:{
        name:data.name,
        description:data.description,
        moreAboutProduct:data.moreAboutProduct,
        categoryId:data.categoryId,
        price:data.price,
        discountPercentage:data.discountPercentage,
        discountPrice:data.discountPrice,
        sizes:data.sizes,
        colors:data.colors,
        refundable:data.refundable,
        returnable:data.returnable,
        returnWindowDays:data.returnWindowDays,
        stock:data.stock,
        stockToDisplay:data.stockToDisplay,
        sku:data.sku,
        lowStockThreshold:data.lowStockThreshold,
        isActive:data.isActive,
        isFeatured:data.isFeatured,
    }})

res.status(201).json({success:true,message:'product created successfully',data:getSafeProduct(product)})
}catch(e){
    logger.info("error while creating product",e)
    throw new ApiError("internal server error",500)
}
}