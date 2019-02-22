import { Schema, model } from 'mongoose';
import { compare } from 'bcryptjs';

const UserSchema = new Schema({
    email: { type: String, 
            unique:true   
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
    console.log(this.password);
    return compare(password,this.password);
}

const User = model('User', UserSchema);

export default User;