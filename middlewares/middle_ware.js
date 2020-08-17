
const jwt = require('jsonwebtoken')
const {to} = require('await-to-js')
const salt = "shrishti"
const middle = (req,res,next) => {
   const h= (req.headers.authorization)
 
    let g=h.split(' ')
   console.log(g[1]);

      let j= jwt.verify(g[1], salt)
    console.log(j)
    if(j.email) {
        next();
    }
    else {
        res.send("Invalid Token");
    }
}
module.exports = {
    middle
};