let mysql = require('mysql')
let Promise = require('promise')
let connection

const con= () =>{ return new Promise((resolve,reject) => {
    connection = mysql.createConnection( {
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'courses'
    });
    connection.connect(function (err){
        if(err)
        {

            console.log("nope")
            return reject("error in updating database")
        }
        else
        {
            console.log("yes")
            return resolve(connection)

        }
    });
   // let query='INSERT INTO courses_data VALUES(2,\'shrishti\')'
   //  connection.query(query,function (error, results, fields) {
   //      if (error) throw error;
   //      console.log('The solution is: ', results)
   //  });

})}
const create=(query)=>{
    return new Promise((resolve,reject) =>{
        connection.query(query,function (error,results,fields){
          if(error)
              return reject(error)
          else
          {
              console.log("success query executed")
              return resolve(results)
          }
        })
    })
}
module.exports={
    con,create
};
