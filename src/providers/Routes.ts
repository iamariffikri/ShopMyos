import { Router } from 'express'

import HealthController from '../controllers/Health'
import ProductController from '../controllers/Product'
import CheckoutController from '../controllers/Checkout'

const router = Router()

router.get('/health', HealthController.perform)
router.get('/products', ProductController.perform)
router.post('/checkout', CheckoutController.perform)

export default router
