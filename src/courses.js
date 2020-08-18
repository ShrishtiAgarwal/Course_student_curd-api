const express = require('express')
const { parse } = require("path");
const fs = require('fs')
const app = express.Router()
const {middle} = require('./../middlewares/middle_ware')


//-------------------- TO GET ALL THE COURSES -------------------//

app.get('',middle,(re,res)=> {
 // Reading all courses from json file and displaying it on Postman or console


    fs.readFile("data(Jason)/courses.json",function(err, data) {

        // Check for errors
        if (err) throw err

        // Converting to JSON

        let user;
        user = JSON.parse(data);
        let obj1={
            "data":[]
        }
        for( obj in user.data)
        {
            const id=user.data[obj].id
            const name=user.data[obj].name
            obj1.data.push({id,name})
        }
        console.log(obj1) // Print users on console
        res.send(obj1) // Printing on postman
    });
})

//----------------- TO GET COURSE PRINTED HAVING SPECIFIC COURSE ID----------------//

app.get('/:id',middle,(req,res) => {

    const idd=parseInt(req.params.id)
    // READING FILE
    fs.readFile('data(Jason)/courses.json',function(error,data){
        if(!error) {

            // CONVERTING JASON DATA
            const jsondata = JSON.parse(data)
            let flag = 0
            for (obj in jsondata.data) {
                if (jsondata.data[obj].id === idd) {
                    res.send(jsondata.data[obj])
                    flag = 1
                }
            }

            // IF there is no such course
            if (flag === 0) {
                res.send("No course with this id is present")
            }
        }
        else
        {
            res.send(error)
        }
    })
})

app.use(express.json())



//-------------------- ADDING COURSE -----------------------------------------------------//



app.post('',middle,(req,res) =>{
    //res.send("Testing")
    //const id = req.body.Id;
    const name = req.body.name;
    const description = req.body.description;
    const availableSlots = req.body.availableSlots;


// stringify JSON Object

    //console.log(jsonContent);
    fs.readFile("data(Jason)/courses.json",  function(err,data){
        if (!err) {
            let obj1
            console.log(data)
            obj1 = JSON.parse(data)

            let l
            if(obj1.data.length>0)
                l=obj1.data[obj1.data.length-1].id+1
            else
                l=1
            const jsonData={
                id : l,
                name : name ,
                description : description,
                enrolledStudents:[],
                availableSlots:availableSlots

            }

            console.log(obj1)
            obj1.data.push(jsonData); //add some data
            let json = JSON.stringify(obj1,null,2); //convert it back to json
            fs.writeFile('data(Jason)/courses.json', json, "utf8" ,()=>{
               res.json({"success":"true"});
            })




        } else {
           res.send("error");
        }
    })

})

//---------------------- TO ENROLL STUDENTS --------------------------//


app.post('/:id/enroll',middle,(req,res)=>{
    const idd=parseInt(req.params.id);
    console.log(" heyyyy",idd)

    const student_id=parseInt(req.body.studentId);
    console.log(student_id)
    let course = fs.readFileSync('data(Jason)/courses.json');
    let student=fs.readFileSync('data(Jason)/Students.json')
    let student_data = JSON.parse(student);

            //console.log("hey")
            //console.log(course_data)
            let course_data = JSON.parse(course)
            console.log(course)
            //const obj1 = JSON.parse(data)
            let y=0
            for(obj in course_data.data)
            {
                console.log(course_data.data[obj].id)
                if(course_data.data[obj].id===idd)
                {
                    y=1
                    if(course_data.data[obj].availableSlots>0)
                    {
                        console.log("here")

                        course_data.data[obj].enrolledStudents.push(
                            {id:student_id,name:student_data.data[student_id-1].name})
                        course_data.data[obj].availableSlots=course_data.data[obj].availableSlots-1
                    }
                }


            }
            if(y===0)
                res.send("No such id is present")

            let json = JSON.stringify(course_data,null,2); //convert it back to json
            fs.writeFile('data(Jason)/courses.json', json, 'utf8' ,()=>{
                res.json({"success":"true"});
           })

        console.log("out")



})


//-------------------- TO REMOVE STUDENTS -------------------------///


app.put('/:id/deregister',middle,(req,res) =>{
    //res.send("put")
    const z=parseInt(req.params.id)
    const student_id = parseInt(req.body.studentId)
    let course = fs.readFileSync('data(Jason)/courses.json');
  //  let dataa = fs.readFileSync('data(Jason)/courses.json')

          let jsondata = JSON.parse(course)
          const h=[]
          let flag=0
          //console.log(jsondata)
          for(obj in jsondata.data)
          {

              if(jsondata.data[obj].id===z)
              {
                    flag=1

                  //console.log(student_index)
                  let student_index=jsondata.data[obj].enrolledStudents.indexOf(student_id)
                    jsondata.data[obj].enrolledStudents.splice(student_index,1);
                  jsondata.data[obj].availableSlots++
              }
          }
      if(flag===0)
          res.send("Invalid course/studentid")
          //console.log(h)
         // jsondata.data[obj].enrolledStudents=h

    else{
    let json = JSON.stringify(jsondata,null,2);
          fs.writeFile('data(Jason)/courses.json', json, 'utf8' ,()=>{
              res.json({"success":"true"});
          })}




})

module.exports=app;
