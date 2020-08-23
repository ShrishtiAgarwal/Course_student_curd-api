const express=require('express')
const app=express.Router()
const fs=require('fs')
const {parse} = require("path");
const {middle} = require('./../middlewares/middle_ware')
const bcrypt = require('bcrypt')
const {to} = require('await-to-js')
const {con,create}=require('./../lib/sql_connection')
const{signup_validation}=require('./../lib/joi')
con()


//--------------------------password encryption----------------------------------------------------

const passwordHash= async (password) =>{
    const saltRounds=12
    const [error,new_password]=await to(bcrypt.hash(password, saltRounds))
    return new_password
}
//-------------------------------------------DISPLAYING ALL STUDENTS------------------------------------------------------

app.get('',async (req,res)=>{
        const query=`select id,name from student_data`
        const student=create(query)
        await student.then((results)=>{
            res.json({
                "data":student,
                "error":"null"
            })
        }).catch(error => {
            res.send({
                "error":"error in bringing data"
            })
        })

})
app.use(express.json())



//---------------------------------------------------------signup-------------------------------------------------------//
app.post("/signup",async (req,res) => {

    let validate = await login_validation.validate(req.body);

    if(validate && validate.error)
    {
        return res.json({ data: null, error: validate["error"].message });
    }
    let {userName, email, password} = (req.body)
    const encryptedpassword = await passwordHash(password)
    let query = `insert into student_data (name,email,encrypted_password) values (\'${userName}\',\'${email}\',\'${encryptedpassword}\');`


    create(query).then(function (results) {
        res.json({
            "data": "query executed",
            "error": "null"
        })
    }).catch(error => {
        res.json({
            "error": "no database"
        })
    })
})
//-----------------------------------------------------------------logout-----------------------------------------------
app.post("/logout",(req,res) =>{
    let email=parse(req.body.email)

    const query2=`update student_data set islogin="false" where email=\'${email}\'`
    create(query2).then(()=>{
        res.json(
            { "data":"logout successfully"}
        ).catch({
            "error":"logout failed"
        })
    })
})




module.exports=app;
