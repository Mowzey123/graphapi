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
            req.session={};
            const newuser = await User.create(args);
            req.session.userid = newuser._id;
            return newuser;
        },
        Signin: async (root: any, args: any,{req}:any,info:any) => {
            if(req.session){
                return User.findById(req.session.userid);
            }
            await Joi.validate(args,validation.signinvalidation,{abortEarly:false});
            const userobj = await auth.signInUser(args);
            if(userobj){
                if(!req.session) req.session = {};
                req.session.userid = userobj._id;
            }
            return userobj;
        },
        Signout: (root: any, args: any,{req,res}:any,info:any)=>{
            return auth.Signout(req,res);
        }
    }
}