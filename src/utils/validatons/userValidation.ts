import {z} from 'zod'
export const registerUserSchema=z.object({
    email:z.string().email('invalid email address'),
    username:z.string().min(3).max(12),
    password:z.string().min(6).max(12),
    otp:z.number().min(6)
})