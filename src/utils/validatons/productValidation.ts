import { z } from "zod"

export const ImagesSchema=z.object({
  altText:z.string(),
  isPrimary:z.boolean(),
  sortOrder:z.number(),
  productVariantId:z.string().optional(),
  productId:z.string()
})

export const variantSchema = z.object({
  size: z.string().min(1).max(20).optional(),
  color: z
    .string()
    .min(1)
    .max(50)
    .trim()
    .regex(
      /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$|^[a-zA-Z]+$/,
      "Color must be a valid name or hex code"
    )
    .optional(),

  price: z
    .number({ error: "Price is required" })
    .positive("Price must be greater than 0")
    .multipleOf(0.01),

  discountPercentage: z
    .number()
    .min(0)
    .max(100)
    .default(0),

  discountPrice: z
    .number()
    .positive()
    .multipleOf(0.01)
    .optional(),

  stock: z
    .number()
    .int()
    .min(0),

  stockToDisplay: z
    .number()
    .int()
    .min(0),

  sku: z
    .string()
    .min(3)
    .max(100)
    .trim().optional(),

  lowStockThreshold: z
    .number()
    .int()
    .min(0)
    .default(5),
    images:z.array(ImagesSchema).min(1,'Atleast one Image is required')
  })
export const productSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(255)
    .trim(),

  description: z
    .string()
    .min(10)
    .max(5000)
    .trim(),

  moreAboutProduct: z
    .string()
    .max(10000)
    .trim()
    .optional(),

  categoryId: z.string().uuid().optional(),

  refundable: z.boolean().default(false),

  returnable: z.boolean().default(false),

  returnWindowDays: z
    .number()
    .int()
    .min(1)
    .max(365)
    .optional(),

  isActive: z.boolean().default(true),

  isFeatured: z.boolean().default(false),

  // ⭐ VARIANTS ARRAY
  variants: z
    .array(variantSchema)
    .min(1, "At least one variant is required")
})


export const createProductSchema = productSchema

export const updateProductSchema = productSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
)

// ─── Params ───────────────────────────────────────────────────────────────────

export const productParamsSchema = z.object({
  id: z.string().uuid('Invalid product ID'),
})

export const productSlugParamsSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
})

// ─── Query / Filters ──────────────────────────────────────────────────────────

export const productQuerySchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  limit:       z.coerce.number().int().min(1).max(100).default(20),
  categoryId:  z.string().uuid().optional(),
  isActive:    z.coerce.boolean().optional(),
  isFeatured:  z.coerce.boolean().optional(),
  minPrice:    z.coerce.number().min(0).optional(),
  maxPrice:    z.coerce.number().min(0).optional(),
  search:      z.string().max(100).trim().optional(),
  sortBy:      z.enum(['price', 'createdAt', 'averageRating', 'reviewCount']).default('createdAt'),
  sortOrder:   z.enum(['asc', 'desc']).default('desc'),
})
.refine(
  (data) => !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice,
  {
    message: 'minPrice cannot be greater than maxPrice',
    path: ['minPrice'],
  }
)

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductParams      = z.infer<typeof productParamsSchema>
export type ProductQuery       = z.infer<typeof productQuerySchema>