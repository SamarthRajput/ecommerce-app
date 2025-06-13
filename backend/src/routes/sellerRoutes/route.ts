// backend/src/routes/sellerRoutes/route.ts
import { Router } from 'express'
import { registerSeller, loginSeller } from '../../controllers/sellerController/route'

const router = Router()

console.log('Seller routes loaded')

router.post('/register', registerSeller)
router.post('/login', loginSeller)

export default router