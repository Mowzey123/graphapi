import User from '../models/user.model';
import mongoose from 'mongoose';
import { UserInputError, AuthenticationError } from 'apollo-server-core';
import {hash,compare} from 'bcryptjs';
import Joi from 'joi';
import validation from '../helpers/validations';
import auth from '../helpers/auth';

require('../config/mongodb.connect');

export default {
    Query:{
        setsessinfo:(root: any, id: any, {req}:any,info:any)=>{
            auth.checkSignedIn(req); 
            return User.findById(req.session.userid);
        },
        user: (root: any, id: any, {req}:any,info:any) => {
            auth.checkSignedIn(req);
            if(!mongoose.Types.ObjectId.isValid(id)){
                throw new UserInputError(`${id} is not a valid user id`);
            }
            return User.findById(id);
        },
        users : (root:any,args:any,{req}:any,info:any) => {
          //todo auth,projection,pagination
            auth.checkSignedIn(req);
            return  User.find({});
        }
    },
    Mutation:{
        Signup : async (root: any, args: any,{req}:any,info:any) => {
            auth.checkSignedOut(req);
            await Joi.validate(args,validation.signUpvalidation,{abortEarly:false});
            args.password = await hash(args.password, 12);
            return User.create(args);
        },
        Signin: async (root: any, args: any,{req}:any,info:any) => {
            if(req.session){
                return User.findById(req.session.id);
            }
            await Joi.validate(args,validation.signinvalidation,{abortEarly:false});
            const user = await User.findOne({email:args.email});
            if(user){
                const temppass = user.password.toString();
                if(await compare(args.password,temppass)){
                    delete user.password;
                    // req.session = {};
                    //Session
                    console.log(req.req.session);
                    req.req.session.Session.id = user._id;//sets user cookie on response
                    
                    return req;
                }else{
                    throw new AuthenticationError("Invalid Password");
                }
            }else{
                throw new AuthenticationError("Email address not found");
            }
        },
        Signout: (root: any, args: any,{req,res}:any,info:any)=>{
            return auth.Signout(req,res);
        }
    }
}