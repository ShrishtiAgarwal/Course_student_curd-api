
const jwt = require('jsonwebtoken')
const {to} = require('await-to-js')
const {parse} = require("path");
const {con,create}=require('./../lib/sql_connection')
con();

const salt = "shrishti"
let obj1
const middle = (req,res,next) => {
   const h= (req.headers.authorization)
    if(typeof h==='undefined')
    {
        res.json({
            "error":"Token Invalid"
        })
    }
    else {


        let g = h.split(' ')
        console.log(g[1]);

        let j = verify(g[1], salt, req, res, next)
    }

}
const verify= (token,secret,req,res,next) =>{
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.json({"error":"Token not valid"});
        }
       // console.log(user);
       //req.user = user;
        else {

            obj1=user;
            let query=`select islogin from student_data where email=\'${obj1.email}\'`
            create(query).then((results)=>{
                if(results[0].islogin==="true")
                    return next();
                else
                {
                    return res.json({"error":"Please login first"})
                }
            }).catch(error => {
                return res.json({"error":"Invalid user"})
            })

        }

})
}
const y= (req,res,next) => {

    if(obj1.id===parseInt(req.body.studentId))
    {
        next();
    }
    else
    {
        res.json({
            "error message": "You can't enroll/deregister anyone else"
        })
    }
}
const user=(req,res,next) =>{
    if(obj1.email==='shrishti@admin.com')
    {
        next();
    }
    else{
        res.json({
            "error message":"Only admin can add/remove a course"
        })
    }
}
module.exports = {
    middle,y,user
};