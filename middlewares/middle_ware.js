
const jwt = require('jsonwebtoken')
const {to} = require('await-to-js')
const salt = "shrishti"
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
            next();
        }

})
}
module.exports = {
    middle
};