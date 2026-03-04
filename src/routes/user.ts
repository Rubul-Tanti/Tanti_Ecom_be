import express from 'express'
import { asyncError } from '../middleware/errorHandler'
import { emailverification } from '../controlers/authentication/email_verification'
import registerUser from '../controlers/authentication/registerUser'
import LoginUser from '../controlers/authentication/loginUser'
import updateUser from '../controlers/authentication/updateuser'
import  authorizationMiddleware  from '../middleware/authentication'
import { refreshUser } from '../controlers/authentication/refresh'
// import { deleteUser } from '../controlers/authentication/deleteUser'
const router=express.Router()

router.post('/email-verification',asyncError(emailverification))
router.post('/register',asyncError(registerUser))
router.post('/login',asyncError(LoginUser))
router.post('/update',authorizationMiddleware,asyncError(updateUser))
router.get('/refresh',asyncError(refreshUser))
// router.delete('/delete',asyncError(deleteUser))

export default router