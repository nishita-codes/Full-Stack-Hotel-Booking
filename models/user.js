// to store any data of the new user in the database

import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    _id : {type:string , required:true},
    username : {type:string , required:true},
    email : {type:string , required:true},
    image:{type:string , required:true},
    role : {type:string , enum:["user" , "hotel-owner"] , default:"user"},
    recentSearchedCities :[{type:string , required:true}],

} , {timestamps:true});

const User = mongoose
.model("User" , userSchema); // for storing in the database

export default User;
