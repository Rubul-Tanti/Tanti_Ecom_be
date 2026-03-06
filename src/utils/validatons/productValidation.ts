import { z } from 'zod'
export const productSchema = z.object({

  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be at most 255 characters')
    .trim(),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be at most 5000 characters')
    .trim(),

  moreAboutProduct: z
    .string()
    .max(10000, 'More about product must be at most 10000 characters')
    .trim()
    .optional(),

  categoryId: z.string().uuid('Invalid category ID').optional(),

  price: z
    .number({error: 'Price is required' })
    .positive('Price must be greater than 0')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),

  discountPercentage: z
    .number()
    .min(0, 'Discount percentage cannot be negative')
    .max(100, 'Discount percentage cannot exceed 100')
    .default(0),

  discountPrice: z
    .number()
    .positive('Discount price must be greater than 0')
    .multipleOf(0.01, 'Discount price must have at most 2 decimal places')
    .optional(),

  sizes: z
    .array(z.string().min(1).max(20).trim())
    .default([]),

  colors: z
    .array(
      z.string()
        .min(1)
        .max(50)
        .trim()
        .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$|^[a-zA-Z]+$/, 'Color must be a valid name or hex code')
    )
    .default([]),

  refundable: z.boolean().default(false),

  returnable: z.boolean().default(false),

  returnWindowDays: z
    .number()
    .int('Return window must be a whole number')
    .min(1, 'Return window must be at least 1 day')
    .max(365, 'Return window cannot exceed 365 days')
    .optional(),

  stock: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .default(0),

  stockToDisplay: z
    .number()
    .int('Stock to display must be a whole number')
    .min(0, 'Stock to display cannot be negative')
    .default(0),

  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(100, 'SKU must be at most 100 characters')
    .trim()
    .optional(),

  lowStockThreshold: z
    .number()
    .int('Low stock threshold must be a whole number')
    .min(0, 'Low stock threshold cannot be negative')
    .default(5),

  // ── Status ─────────────────────────────────────────────────────────────────
  isActive: z.boolean().default(true),

  isFeatured: z.boolean().default(false),
})
.refine(
  (data) => !data.returnable || data.returnWindowDays !== undefined,
  {
    message: 'returnWindowDays is required when returnable is true',
    path: ['returnWindowDays'],
  }
)
.refine(
  (data) => !data.discountPrice || data.discountPrice < data.price,
  {
    message: 'Discount price must be less than the original price',
    path: ['discountPrice'],
  }
)
.refine(
  (data) => data.stockToDisplay <= data.stock,
  {
    message: 'Stock to display cannot exceed actual stock',
    path: ['stockToDisplay'],
  }
)


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