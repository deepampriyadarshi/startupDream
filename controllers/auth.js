const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const { reset } = require('nodemon');
const { query } = require('express');


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
            if(result.length > 0){
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

exports.home = (req, res) =>{
    db.query('SELECT * FROM connection WHERE start_UID = ?', [req.session.userID], (err, reslt) => {
        if(reslt){
            db.query('SELECT * FROM connection WHERE end_UID = ?', [req.session.userID], (error, result) => {
                if(reslt){
                    res.render('home',{
                        userName: req.session.userName,
                        profile_image: req.session.profilePic,
                        userid: req.session.userID,
                        following: reslt.length,
                        followers: result.length
                    });
                }
            }) 
        }
    })   
    
}

// async function checkFollowing(start, end){
//     try{
//     const result = await db.query('SELECT * FROM connection WHERE start_UID = ? AND end_UID = ?', [start, end])
//     if(result.length > 0){
//         return true;
//     }else{
//         return false;
//     }}
//     catch(err){
//     console.log(err);}
// }

// async function checkFollowing(start, end){
    
//     const result = await db.query('SELECT * FROM connection WHERE start_UID = ? AND end_UID = ?', [start, end])
//     if(result){
//         console.log(result);
//         return 1;
//     }else{
//         return 0;
//     }
//     // catch(err){
//     // console.log(err);}
// }

function checkFollowing(start, end, cb){
    db.query('SELECT * FROM connection WHERE start_UID = ? AND end_UID = ?', [start, end], (error, result)=>{
        if(result.length > 0){
            // console.log(result);
            return cb(true);
        }else{
            return cb(false);
        }
    })
}


exports.follow = (req,res) => {
    const start_point = req.session.userID;
    const end_point = req.body.end_user;
    db.query('INSERT INTO connection SET ?', {start_UID: start_point, end_UID: end_point}, (error,result) =>{
        if(result){
            res.redirect('/discover');
        }else{
            console.log(error);
        }
    })
}

exports.unfollow = (req,res) => {
    const start_point = req.session.userID;
    const end_point = req.body.end_user;
    db.query('DELETE FROM connection WHERE start_UID = ? AND end_UID = ?', [start_point,end_point], (error,result) =>{
        if(result){
            res.redirect('/discover');
        }else{
            console.log(error);
        }
    })
}

exports.discover =  (req,res) =>{
    const currentUser = req.session.userID;

    try{
        db.query('SELECT `uid`,`u_name`, `img` FROM user_detail WHERE NOT uid = ?', [currentUser], (error,result) => {
    
            var list = [];
            var status;
            result.forEach(async (row) =>  {
                var a;
                setTimeout(() => {
                    checkFollowing(currentUser, row.uid, function(result){
                        a = result;
                        list.push({id: row.uid, name: row.u_name, img: row.img, follow_status: a});
                    });
                }, 100);
                
                // console.log(list);
            })
            if(result){
                setTimeout(() => {
                    return res.render('discover', {
                        users: list
                    })
                }, 200);
            }
            else{
                console.log(error)
            }
        })}
        catch(err){
            console.log(err);
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