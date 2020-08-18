const express = require('express')
const app = express.Router()
const fs = require('fs')
const { parse } = require("path")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {to} = require('await-to-js')

//--------------------------generate token----------------------------------------------------

const salt = "shrishti"
const generate = (password,salt) => {

    let token = jwt.sign( password , salt);
    return token;
}

//--------------------------password encryption----------------------------------------------------
const passwordHash= async (password) =>{
    const saltRounds=12
    const [error,new_password]=await to(bcrypt.hash(password, saltRounds))
    return new_password
}
// -------------------------login----------------------------

app.post("/login",(req,res) =>{
    const email =(req.body.email)
    const password =(req.body.password)
    // if(userName==="Iron Man")
    //     console.log("true")
    // console.log(password)
    //let input=verify(password)
    let pass = fs.readFileSync('data(Jason)/Auth.json')
    let passcode=JSON.parse(pass)
    passcode.data.forEach(obj =>{
        console.log(obj.email)
        if(obj.email===email) {
            console.log("true")
            bcrypt.compare(password, obj.encryptedpassword, (err, result) => {
                if(result===true)
                {
                    res.json({

                        "accessToken": generate(obj,salt)


                    })
                }
                else{
                    res.json({
                        "error":"Password invalid"
                    })

                }

            })
        }
        else{
            res.json({
                "error":"Email invalid"
            })
        }
    })


})
//let h={};




//--------------------------signup------------------------------------//
app.post("/signup",async (req,res) => {
    // const userName =(req.body.userName)
    //  const email = req.body.email
    let {userName, email, password} = (req.body)
    let  course = fs.readFileSync('data(Jason)/Auth.json')

        let user = JSON.parse(course)
        const encryptedpassword = await passwordHash(password)
      //  h={encryptedpassword}
       // console.log(h)
       // console.log(encryptedpassword)
        user.data.push({userName, email, encryptedpassword})
        let json = JSON.stringify(user,null,2)

        fs.writeFile('data(Jason)/Auth.json', json, () => {

        })

    console.log(password)
    res.json({
        "data": {
            "accessToken": "true"
        },
        "error": null
    })
})

module.exports=app;