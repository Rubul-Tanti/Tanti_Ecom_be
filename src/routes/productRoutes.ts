import {Router} from 'express'
import { uploadMiddleware } from '../middleware/multer'
import { createProduct } from '../controlers/product/createProducts'
import { asyncError, multerErrorHandler } from '../middleware/errorHandler'
import { updateProduct } from '../controlers/product/updateProduct'
import authorizationMiddleware from '../middleware/authentication'

 const productRouter=Router()
productRouter.post('/create',authorizationMiddleware,uploadMiddleware.any(),asyncError(createProduct))
productRouter.put('/update/:id',uploadMiddleware.array('file'),asyncError(updateProduct))
productRouter.put('/update-producVariant/:id',uploadMiddleware.array('',7),asyncError(updateProduct))


productRouter.use(multerErrorHandler)
export default productRouter