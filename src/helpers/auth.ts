import {AuthenticationError} from 'apollo-server-express';
import {Request,Response} from 'express';

class Auth{
    checkSignedIn(req: any){
        if(!req.session){
            throw  new AuthenticationError('Session expired');
        }
    }

    checkSignedOut(req: any){
        if(req.session){
            throw  new AuthenticationError('Session runnning');
        }
    }

    Signout(req: any,res: any){
        req.session.destroy((error: any)=>{
            if(error) throw new AuthenticationError("Session scrumbled");
            res.clearCookie('graphql-session');
            return true;
        });
    }
}
 const auth = new Auth();
 export default auth;