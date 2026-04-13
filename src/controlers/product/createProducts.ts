import { Request, Response } from 'express'
import { ApiError } from '../../middleware/errorHandler'
import logger from '../../utils/logger'
import { prisma } from '../../db/prisma'
import { createProductSchema } from '../../utils/validatons/productValidation'
import { Prisma } from '../../generated/prisma/client'
import { uploadToCloudinary } from '../../services/uploadToCloudinary'

type ProductWithVariant = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: {
        images: true
      }
    }
  }
}>

export const getSafeProduct = (product: ProductWithVariant) => {
  return {
    id: product.slug,
    name: product.name,
    description: product.description,
    moreAboutProduct: product.moreAboutProduct,
    refundable: product.refundable,
    returnable: product.returnable,
    returnWindowDays: product.returnWindowDays,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    createdAt: product.createdAt,
    variants: product.variants
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    let uploads:{public_id:string,url:string}[]
    const role = req.user?.role
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return res.status(403).json({ message: "not authorized" })
    }
    const files = req.files as Express.Multer.File[]

    if (!files?.length) {
    return res.status(400).json({message:'atleast one pic is required'})
    }
    console.log(req.body)

    const validationResult = createProductSchema.safeParse(req.body)

    if (!validationResult.success) {
      return res.status(400).json({
        message: "validation error",
        error: validationResult.error.flatten()
      })
    }

    const data = validationResult.data
    if(files.length){
      uploads = await Promise.all(
        files.map(file =>uploadToCloudinary(file))
      )
    }
    const product = await prisma.product.create({
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

        variants: {
          create: data.variants.map((v, i) => ({
            size: v.size,
            color: v.color,
            colorName:v.colorName,
            price: v.price,
            discountPrice: v.discountPrice,
            discountPercentage: v.discountPercentage,
            sku: `${data.name}-${v.color}-${v.size}-${Date.now()}-${i}`,
            stock: v.stock,
            stockToDisplay: v.stockToDisplay,
            lowStockThreshold: v.lowStockThreshold,

            images: {
              create: v.images.map((img, i) => ({
                url:uploads.find((u) => u.public_id.split('-')[0] ===img.altText)?.url||'',
                altText: img.altText,
                isPrimary: img.isPrimary,
                sortOrder: i,
              }))
            }
          }))
        }
      },

      include: {
        variants: {
          include: {
            images: true
          }
        }
      }
    })

    res.status(201).json({
      success: true,
      message: 'product created successfully',
      data: getSafeProduct(product)
    })

  } catch (e) {
    logger.error("error while creating product", e)
    throw new ApiError("internal server error", 500)
  }
}