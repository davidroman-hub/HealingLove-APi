const express = require('express');
const router = express.Router();

// need to be auth and signin thats why we used the middleware here
const {requireSignin, adminMiddleware, isAdmin} = require('../controllers/auth')
//also we gonna use user controllers as well
const {addOrderToUserHistory } = require('../controllers/user')
const { create,listOrders, getStatusValues, orderById, updateOrderStatus , orderSearch,read} = require('../controllers/order')
const { decreaseQuantity } = require("../controllers/product")
const {orderValidator}= require('../validators/auth')

router.post(
    "/order/create/:Id",
     requireSignin,
     addOrderToUserHistory,
     decreaseQuantity,
    create,
    )

//list all the orders in the front end !
 router.get('/order/list/:Id', requireSignin,listOrders);
 router.get('/order/status-values/:Id', requireSignin,adminMiddleware,getStatusValues);
 router.put('/order/:orderd/status/:Id',requireSignin, adminMiddleware, updateOrderStatus);
 router.post("/order/search", orderSearch);
 router.get('/order/:orderId/single/:Id',requireSignin,adminMiddleware ,read);





// router.param('userId', userById)
router.param('orderId', orderById)

module.exports = router