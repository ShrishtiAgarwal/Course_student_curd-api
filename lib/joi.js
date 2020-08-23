const joi = require('joi')

const login_validation = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(2).max(20).required()
});

const enroll_deregister_validation = joi.object().keys({
    studentId:joi.number().positive().required()
})
const signup_validation = joi.object().keys({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).max(10).required()
});
module.exports={
    login_validation,enroll_deregister_validation,signup_validation
}