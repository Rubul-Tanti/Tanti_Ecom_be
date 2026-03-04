import {z} from 'zod'
export const registerUserSchema=z.object({
    email:z.string().email('invalid email address'),
    userName:z.string().min(3).max(12),
    password:z.string().min(6).max(12),
    otp:z.number().min(6)
})
export const loginUserSchema=z.object({
    email:z.string().email('invalid email address')
    ,password:z.string()
})

export const updateUserSchema = z.object({
  userName: z.string().min(3).max(12).optional(),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional(),

  pincode: z
    .number()
    .int()
    .min(100000, "Pincode must be 6 digits")
    .max(999999, "Pincode must be 6 digits")
    .optional(),

  district: z.string().min(2).optional(),
  postoffice: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  town: z.string().min(2).optional(),
});