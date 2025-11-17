import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
    hotel:{
        type:String , ref:"Hotel" ,  required : true
    },
    hotel:{
        type:String ,  required : true
    },
    pricePerNight:{
        type:Number , required : true
    },
    amenities:{
        type: Array, required : true , ref : "user"
    },
    images: [{type:String }],
    isAvailable : { type :Boolean , default :true},
},{timestamps :true}) ;


// create the model 
const Room = mongoose.model("Room" , roomSchema);

export default Room;