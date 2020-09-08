const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Login page
router.get('/login', (req, res)=>res.render('Login'));

//Register page
router.get('/register', (req, res)=>res.render('Register'));

//Register handle
router.post('/register', (req, res)=>{
    const {name, email, password, password2,status, firstname,lastname,description} = req.body;
    let errors = [];
    
    //check required fields
    if ( !name || !email || !password  || !password2 || !status) {
        errors.push({msg: 'Please fill in all required fields'});
    }
    //check passwords match
    if (password != password2){
        errors.push({msg:'Password do not match'});
    }
    //check pass length
    if (password.length<6){
        errors.push({msg:'Password should be at least 6 characters'});
    }

    //check status
    if (!status in ['read', 'create', 'sign']) {
        errors.push({msg:'status must be one of the provided values'})
    }

    if (errors.length>0){
        res.render('register',{
            errors,
            name, 
            email, 
            password, 
            password2,
            status,
            firstname,
            lastname,
            description    
        });
    } else {
        // validation passed
        User.findOne({email:email})
        .then( (user) =>{
            if (user){
                //user exists
                errors.push({msg: 'Email is already registered'})
                res.render('register',{
                    errors,
                    name, 
                    email, 
                    password, 
                    password2,
                    status,
                    firstname,
                    lastname,
                    description                    
                });
            } else {
        const newUser = new User({
            name, 
            email, 
            password,
            status,
            firstname,
            lastname,
            description
        });

        //hash password
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newUser.password, salt, (err,hash)=>{
                if (err) throw err;
                //set password to hashed
                newUser.password = hash;
                // save user
                newUser.save()
                .then (user => {
                    req.flash('success_msg', 'You are now registered and can login')
                    res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            })
        })
    }

})
    };
});

// Login handle
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })
     (req, res, next);
})

//Logout handle
router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')
})
module.exports = router;