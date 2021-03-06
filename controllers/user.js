const User = require('../models/user')
const {Order} = require('../models/order')
const {errorHandler} = require('../helpers/dbErrorHandler')
// user by id //

exports.userById = (req, res, next, id ) => {
    User.findById(id).exec((err, user )=>{
            if(err || !user){
                return res.status(400).json({
                    error: ' User not Found'
                });
            }
        req.profile = user;
        next();
    });
};


// the method to get the information of the user

exports.read = (req,res) => {
    const userId = req.params.id
    User.findById(userId).exec((err,user) => {
        if(err || !user){
            return res.status(400).json({
                error:'User not found'
            })
        } 
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    })
}

// update methods for the user

exports.update = (req, res) => {
    // console.log('Update user - req.user', req.user, 'update-data ', req.body) <-- this is for see whats we are sending

const {name,phone,password,address,address2} = req.body 

User.findOne({_id: req.user._id},(err,user)=>{
    if(err || !user){
       return res.status(400).json({
            error: 'User not found'
            })
        }
        if(!name){
            res.status(400).json({
                error: 'Name is required'
            })
        } else {
            user.name = name
        }

        if(!phone){
            res.status(400).json({
                error: 'Telefono es requerido'
            })
        } else {
            user.phone = phone
        }
        //if(!address){
        //     res.status(400).json({
        //         error: 'Dirección es requerida'
        //     })
        // } else {
        //     user.address = address
        // }if(!address2){
        //     res.status(400).json({
        //         error: 'Dirección es requerida'
        //     })
        // } else {
        //     user.address2 = address2
        // }
        
        if(password){
            if(password.length < 6 ){
                res.status(400).json({
                    error: 'La contraseña debe tener al menos 6 caracteres'
                })
            } else {
                user.password = password
            }
        }

        user.save((err, updatedUser) =>{
            if(err){
                console.log('User update error', err)
                res.status(400).json({
                    error:'User updated failed'
                })
            }
            updatedUser.hashed_password = undefined
            updatedUser.salt = undefined
            res.json(updatedUser)
        })
    });
};



exports.addOrderToUserHistory = (req, res, next) => {
    let history = [];

    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount,
            // createdAt: req.body.order.createdAt

        });
    });

    User.findOneAndUpdate({ _id: req.user._id },
         { $push: { history: history } },
         { new: true }, 
         (error, data) => {
            if (error) {
                return res.status(400).json({
                    error: 'Could not update user purchase history'
            });
        }
        next();
    });
};


/// purchase history

exports.purchaseHistory = (req,res) => {
    Order.find({client_id:req.user._id})
    .populate('user','_id name')
    .sort('-created')
    .exec((err,orders)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json(orders)
    })
}