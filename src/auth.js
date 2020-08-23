const express = require('express')
const app = express.Router()
const fs = require('fs')
const { parse } = require("path")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {to} = require('await-to-js')
const {middle,y,user} = require('./../middlewares/middle_ware')
const {con,create}=require('./../lib/sql_connection')
con();
//--------------------------generate token----------------------------------------------------

const salt = "shrishti"
const generate = (password,salt) => {
    let token = jwt.sign( password , salt);
    return token;
}


// -------------------------login----------------------------

app.post("/login",async (req,res) => {
        //const Email = parse(req.body.email)
        const {email,password} = (req.body)
   // console.log(email,"here")
        const query = `select * from student_data where email=\'${email}\'`


        let student=create(query)

        await student.then((results)=> {
            const query2=`update student_data set islogin="true" where email=\'${email}\'`
            create(query2)
            let obj={
                id:results[0].id,
                name:results[0].name,
                email:results[0].email,
                encrypted_password:results[0].encrypted_password

            }

        bcrypt.compare(password,results[0].encrypted_password,(err,result)=>{
            if(result===true)
            {

                res.json({
                        "data":generate(obj,salt)
                    })
            }
            else{
                res.json({
                    "error":"Email/password Invalid"
                })
            }
        })
        }).catch( (error) => {
            res.json(
                {
                    "error":"no access to database"
                }
            )
        })
    }
)
//-------------------------------------------------remove user----------------------------------------------------//

app.post("/delete_user",middle,user,async (req,res)=>{
    let name=(req.body.name);
    console.log(name)
    let query=`delete FROM student_data where name=\'${name}\'`
    await create(query).then((result)=>{
        console.log(result)
        let query2=`DELETE FROM enrollment where student=\'${name}\'`
        create(query2).then(()=>{
             res.json({
                 "data":"remove user"
             })
         }).catch(error => {
             res.json({
                 "error":"Can't remove user"
             })
         })

    }).catch(error => {
        res.json({
            "error":"Can't remove user"
        })
    })
})




module.exports=app;
