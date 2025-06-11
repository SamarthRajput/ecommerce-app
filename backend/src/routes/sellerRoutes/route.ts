import { Router, Request, Response, NextFunction } from 'express'
import { registerSeller } from '../../controllers/sellerController/route'
const router = Router()

const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
console.log('Seller routes loaded')
router.post('/register', asyncHandler(registerSeller));

export default router
