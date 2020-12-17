const express = require('express');
const session = require('express-session');
const router = express.Router();



const redirectLogin = (req,res,next) => {
    if (!req.session.userID){
        res.redirect('/login')
    }else{
        next();
    }
}

const redirectHome = (req,res,next) => {
    if (req.session.userID){
        res.redirect('/home')
    }else{
        next();
    }
}

router.get('/', redirectHome, (req,res) =>{
    res.render('index');
});

router.get('/register', redirectHome, (req,res) =>{
    res.render('register');
});

router.get('/login', redirectHome, (req,res) =>{
    res.render('index');
});

router.get('/home', redirectLogin, (req,res) =>{
    res.render('home',{
        userName: req.session.userName,
        profile_image: req.session.profilePic,
    });
});

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
        if(err){
            return res.redirect('/home');
        }
        res.clearCookie('sid');
        res.redirect('/login')
    }) 
})


module.exports = router;