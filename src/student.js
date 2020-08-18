const express=require('express')
const app=express.Router()
const fs=require('fs')
const { parse } = require("path");
const {middle} = require('./../middlewares/middle_ware')
// ADDING STUDENT WITH ID AND NAME


app.get('',middle,(req,res)=>{
    fs.readFile('data(Jason)/Students.json',function (error,data){
        if(error)
        {
            res.send("error in connection to data files")
        }
        res.send(data)
    })
})
app.use(express.json())


// DISPLAYING ALL STUDENTS

app.post('',middle,(req,res)=>{
    const obj = req.body.name
    fs.readFile('data(Jason)/Students.json',function (error,data){
        const obj1=JSON.parse(data)
        let l
        if(obj1.data.length>0)
            l=obj1.data[obj1.data.length-1].id+1
        else
            l=1
        obj1.data.push({ "id" :l , "name":obj})
        let json=JSON.stringify(obj1,null,2)
        fs.writeFile('data(Jason)/Students.json',json,()=>{
            res.send({"success":"true"})
        })

    })
})
module.exports=app;
