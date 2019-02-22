import {AuthenticationError} from 'apollo-server-express';
import {Request,Response} from 'express';
import User from '../models/user.model';
import { compare } from 'bcryptjs';

class Auth{
    checkSignedIn(req: Request){
        if(!req.session){
            throw  new AuthenticationError('Session expired');
        }
    }

    checkSignedOut(req: Request){
        if(req.session){
            throw  new AuthenticationError('Session runnning');
        }
    }

    Signout(req:any,res:any){
        req.session.destroy((error: any)=>{
            if(error) throw new AuthenticationError("Session scrumbled");
            res.clearCookie('session');
            return true;
        });
    }

    async signInUser(args: { email: string; password: string; }){
        const user = await User.findOne({email:args.email});
        if(user){
            const userobj = user.toObject();
            if(await compare(args.password,userobj.password)){
                return userobj;
            }else{
                throw new AuthenticationError("Invalid Password");
            }
        }else{
            throw new AuthenticationError("Email address not found");
        }
    }
}

const auth = new Auth();
export default auth;