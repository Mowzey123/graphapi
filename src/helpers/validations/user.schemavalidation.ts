import Joi from 'joi';
const username = Joi.string().alphanum().min(7).required().label('Username');
const email = Joi.string().required().email().label('Email address');
const password =Joi.string().min(8).max(15).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).*/).options({
    language:{
        string:{
            regex:{
                base:"Password length (8-12 characters),Must have atleast one lowercase letter,one uppercase letter,one special character"
            }
        }
    }
});

const userschemavalidation ={
    signupvalidation:Joi.object().keys({
        username:username,
        email:email,
        password:password,  
    }),

    signinvalidation:Joi.object().keys({
        email:email,
        password:password
    }),

}

export default userschemavalidation;