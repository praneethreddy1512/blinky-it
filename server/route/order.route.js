import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, getOrderDetailsController, paymentController, webhookStripe } from '../controllers/order.controller.js'
import express from 'express'
const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook', express.raw({ type: 'application/json' }), webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)

export default orderRouter