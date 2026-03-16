import { ApiError } from "../../middleware/errorHandler"
import logger from "../../utils/logger"
import { Request, Response } from 'express'
import { updateProductSchema, variantSchema } from "../../utils/validatons/productValidation"
import { prisma } from "../../db/prisma"
import { getSafeProduct } from "./createProducts"

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const role = req.user?.role

        if (role !== "ADMIN"&&role !=='MODERATOR') {
            return res.status(403).json({ message: "Unauthorized" })
        }

        const slug = req.params.id as string
        if(!slug){
            return res.status(404).json({message:"enter all fields"})
        }

        const parsed = updateProductSchema.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                error: parsed.error.flatten()
            })
        }
        const data = parsed.data

        const product = await prisma.product.findUnique({
            where: { slug }
        })

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        const updatedProduct = await prisma.product.update({
            where: { slug },
            data: {
                name: data.name,
                description: data.description,
                moreAboutProduct: data.moreAboutProduct,
                categoryId: data.categoryId,
                refundable: data.refundable,
                returnable: data.returnable,
                returnWindowDays: data.returnWindowDays,
                isActive: data.isActive,
                isFeatured: data.isFeatured,
            },
            include: { variants: true }
        })

        return res.status(200).json({
            message: "Product updated successfully",
            success: true,
            data: getSafeProduct(updatedProduct)
        })

    } catch (e:unknown) {
        if(e && typeof e =='object' && 'name' in e&& e.name==='p2025'){
            return res.status(404).json({message:"product not found"})
        }

        logger.error("Error while updating product", e)
        throw new ApiError("Internal Server Error", 500)
    }
}

export const updateVariant = async (req: Request, res: Response) => {

    try {
             const id = req.params.id as string
        if(!id){
            return res.status(404).json({message:"enter all fields"})
        }
        const role = req.user?.role
        if (role !== "ADMIN"&&role !=='MODERATOR') {
            return res.status(403).json({ message: "Unauthorized" })
        }
        const parsed = variantSchema.safeParse(req.body)
        if(!parsed.success){
            return res.status(400).json({message:"validation error",error:parsed.error.flatten()})
        }

        const updatedVariant=await prisma.productVariant.update({where:{id},data:parsed.data})
    res.status(200).json({message:"product variant updated successfully",success:true,data:updatedVariant})

    } catch (e) {
              if(e && typeof e =='object' && 'name' in e&& e.name==='p2025'){
            return res.status(404).json({message:"product not found"})
        }

        logger.error("Error while updating productVariant", e)
        throw new ApiError("Internal Server Error", 500)
    }
}
