const express = require('express')
const { parse } = require("path");
const fs = require('fs')
const app = express.Router()
app.use(express.json())
const {middle,y,user} = require('./../middlewares/middle_ware')
const {con,create}=require('./../lib/sql_connection')
const {enroll_deregister_validation}=require('./../lib/joi')
con();

//--------------------------------------decreasing slots---------------------------------------------------------------//
async function decreasing_slots(res,idd,student_id) {
    let query=`select availableSlots from courses_data where id=${idd}`
    let as = create(query)
    await as.then((result)=>{
        let z= result[0].availableSlots-1
        if(z<0)
        {
            res.json({
                "error msg":"Not enough avaliable slots"
            })
            return false;
        }
        let query1=`update course_data set availableSlots=${z}`
        create(query1)
        return true;
    })
    //let query = `update course_data set availbale_slots=`
}

//--------------------------------------increasing slots---------------------------------------------------------------//
async function increasing_slots(res,idd,student_id) {

        let query1=`update course_data set availableSlots=availableSlots+1`
        await create(query1)
        return true;


}
//-------------------------------------------------------------TO GET ALL THE COURSES ------------------------------------------------------------------------//



app.get('',middle,(re,res)=> {
 // Reading all courses from json file and displaying it on Postman or console
    const query = `select id,name from courses_data;`
    create(query).then(function (results){
        res.json({
            "data":results,
            "error":"null"
        })
    }).catch(error => {
        res.json({
            "error":"no database"
        })
    })
})

//-------------------------------------------------------- TO GET COURSE PRINTED HAVING SPECIFIC COURSE ID---------------------------------------------//



app.get('/:id',middle,async (req,res) => {
    try {
        let specific_course
        let course_detail
        const idd = parseInt(req.params.id)
        const query = `select * from courses_data where id=${idd}`
        const query2 = `select student_id,student from enrollment where course_id=${idd}`
        let courses=create(query2)
        await courses.then(function (results) {
            specific_course=(results)

            console.log(results)
        }).catch(error => {
            res.json({
                "error": "no database"
            })
        })
        let enrolls= create(query)
            await enrolls.then(function (results) {
           course_detail=(results)
            console.log(results)
        }).catch(error => {
            res.json({
                "error": "no database"
            })
        })



        res.json({
            "course":course_detail,
            "emnrolled": specific_course,
            "error": "null"
        })
    }catch(error){
        res.json({
            "error":"no id exist"
        })
    }
})




//-------------------------------------------- ADDING COURSE -----------------------------------------------------//


app.use(express.json())
app.post('',middle,user,(req,res) => {

    const name = req.body.name;
    const description = req.body.description;
    const availableSlots = req.body.availableSlots;
    let query = `INSERT INTO courses_data (name,description,availableSlots) VALUES (\'${name}\',\'${description}\',${availableSlots})`

    create(query).then(()=>{
        res.json({
            "data":"successful",
            "error":"null"
        })
    }).catch(error => {
        res.json({
            "error":"Can't add a course"
        })
    })

})

//-------------------------------------------- DELETING COURSE -----------------------------------------------------//


app.use(express.json())
app.post('/delete',middle,user,(req,res) => {

    const id = parseInt(req.body.Id);
    console.log(id)
    let query = `DELETE FROM courses_data where id=${id}`
    let query2= `Delete from enrollment where course_id=${id}`

    create(query).then(()=>{
        create(query2).then(()=>{
            res.json({
                "data":"success"
            })
        }).catch(error => {
            res.json({
                "error":"Can't remove course from enrollments"
            })
        })
    }).catch(error => {
        res.json({
            "error":"no course with this id is there"
        })
    })

})

//------------------------------------------------------- TO ENROLL STUDENTS --------------------------//


app.post('/:id/enroll',middle,y,async (req,res)=> {
    let validate = await enroll_deregister_validation.validate(req.params);

    if(validate && validate.error)
    {
        return res.json({ data: null, error: validate["error"].message });
    }
    const idd = parseInt(req.params.id);
    console.log(" heyyyy", idd)


    const student_id = parseInt(req.body.studentId);
    console.log(student_id)

    try {
        let x=decreasing_slots(res, idd, student_id)
        if (x) {
            console.log("here1")
            let query1 = `select name from student_data where id=${student_id};`
            let student = create(query1)
            await student.then(function (result) {
               //  console.log(result[0].name)
                console.log("here2")
                let query2 = `insert into enrollment (course_id,student_id,student) values (${idd},${student_id},\'${result[0].name}\')`
                let enrollment=create(query2)
                enrollment.then(function(result){
                    res.json(
                        {
                            "data": "success"
                        }
                    )}).catch(error => {
                res.json({
                    "error":"Can't enroll"
                })
            })}).catch(error => {
                        res.json({
                                "error": "NO student with this id exist"
                            }
                        )

                })


        }}
        catch(error ){

            res.json({
                    "data": "null",
                    "error": "wrong"
                }
            )
        }

})




//------------------------------------------------ TO REMOVE ENROLLED STUDENTS -----------------------------------------------///



app.put('/:id/deregister',middle,y,async (req,res) => {
    //res.send("put")
    let validate = await enroll_deregister_validation.validate(req.params);

    if(validate && validate.error)
    {
        return res.json({ data: null, error: validate["error"].message });
    }
    const z = parseInt(req.params.id)
    const student_id = parseInt(req.body.studentId)
    increasing_slots(res,z,student_id)
        const query = `delete from enrollment where course_id=${z} and student_id=${student_id}`

        const deregister = create(query)
        await deregister.then(() => {
            res.json({
                "data": "successfully deregistered"
            })
        }).catch(error => {
            res.json({
                "error": "error"
            })
        })



})




module.exports=app
