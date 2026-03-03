import express from 'express'
import { asyncError } from '../middleware/errorHandler'
import { emailverification } from '../controlers/authentication/email_verification'
import registerUser from '../controlers/authentication/registerUser'
const router=express.Router()

router.post('/email-verification',asyncError(emailverification))
router.post('/register',asyncError(registerUser))

export default router