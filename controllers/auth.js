const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const { reset } = require('nodemon');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user'
});

const storage = multer.diskStorage({
    destination: 'public/profile_image/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
}).single('uploaded_image');

exports.login = async (req, res) => {
    try {
        const login_email = req.body.login_mail;
        const login_password = req.body.login_password

        db.query('SELECT * FROM user_detail WHERE email = ?', [login_email], async(error,result) => {
            if(result){
                if(await bcrypt.compare(login_password, result[0].password)){
                    req.session.userID = result[0].uid;
                    req.session.userName = result[0].u_name;
                    req.session.profilePic = result[0].img;
                    res.redirect('/home');
                }else{ 
                    res.status(401).render('index', {
                        message: "Invalid Credentials"
                    })                
                }
            }else{ 
                res.status(401).render('index', {
                    message: "Invalid Credentials"
                })                
            }
        })


    } catch (error) {
        console.log(error);    
    }
}


exports.register = (req,res) =>{
    upload(req, res, (err) => {
        if(err){
            res.render('index',{
                message: err
            })
        }else{
            const name = req.body.name;
            const email = req.body.email;
            const phone = req.body.ph_no;
            const pass = req.body.password;
            const passConfirm = req.body.passCheck;  
            const image = req.file.filename;

            db.query('SELECT email FROM user_detail WHERE email = ?', [email], async (error,result) => {
                if(error){
                    console.log(error);
                }
                if(result.length > 0){
                    return res.render('register', {
                        message: 'That email is already taken'
                    })
                }else if(pass !== passConfirm){
                    return res.render('register', {
                        message: 'Password do not match'
                    })
                }

                // Hashing the Password

                let hashPassword = await bcrypt.hash(pass, 8)
                console.log(hashPassword);

                db.query('INSERT INTO user_detail SET ?', {u_name: name, email: email, phone: phone, password:hashPassword, img: image},(error, result) =>{
                    if(error){
                        console.log(error);
                    }else{
                        console.log(result);
                        return res.render('register', {
                            message: 'User Registered'
                        })
                    }
                } )
            });
        }
    })
    
    
    
    
    // console.log(req.body);
    // res.send("Form Submitted");
}