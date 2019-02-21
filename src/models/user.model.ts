import { Schema, model } from 'mongoose';
import { compare } from 'bcryptjs';

const UserSchema = new Schema({
    email: { type: String, 
            validate:{
                validator:async (email: string):Promise<any> => 
                {
                    await User.where(email).count() === 0
                },
                message: () => {
                    console.log("Email address is already in use");
                    return `Email address is already in use`;
                }
            }    
        },
    password: { type: String, required: true,trim:true },
    username: { type: String, required: true, lowercase: true,trim:true },
},
{timestamps:true}
);

//global methods
UserSchema.statics.notexist = async function(option:{}){
    return await this.where(option).countDocuments() === 0; 
}

//Usermethods
UserSchema.methods.comparePasswords = function(password:string){
    return compare(password,this.password);
}
const User = model('User', UserSchema);
export default User;