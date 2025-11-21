import Hotel from "../models/Hotel.js";
import {v2 as cloudinary} from "cloudinary";
import Room from "../models/Room.js";

// API TO CREATE A NEW ROOM FOR A HOTEL
export const createRoom = async (req , res) =>{
   try{
     const {roomType , pricePerNight , amenities } = req.body;
     const hotel = await Hotel.findOne({ owner : req.auth.userId})

     if(!hotel) return res.json({success : false , message : "No Hotel Found"});


    //  upload images to cloudinary
     const uploadImages = req.files.map(async (file) => {
        const response = await cloudinary.uploader.upload(file.path);
        return response.secure_url;
     })
//  wait for all uploads to complete
     const images = await Promise.all(uploadImages)

    //   storing the data in database
     await Room.create({
       hotel: hotel._id,
       roomType,
         pricePerNight : +pricePerNight,
         amenities : JSON.parse(amenities),
         images,

     })
     res.json({success :true , message : "Room created successfully"})
   }catch(err){
     res.json({success :false , message : "Room created successfully"});
   }
}

// API TO GET ALL ROOMS
export const getRooms = async (req , res) =>{
 try{
  const rooms = await Room.find({isAvailable : true}).populate({
    path:'hotel', 
    populate:{
        path : 'owner',
        select:'image'
    }
  }).sort({createdAt : -1})
  res.json({success : true , rooms});
 }catch(err){
  res.json({success : false , message : err.message});
 }
}


// API TO GET ALL ROOMS FOR A SPECIFIC HOTEL
export const getOwnerRooms = async (req , res) =>{
  try{
   const hotelData = await Hotel.findOne({owner : req.auth.userId})
   const rooms = await Room.find({hotel : hotelData._id.toString()}).populate("hotel");
   res.json({success : true , rooms});
  }catch(err){
   res.json({success : false , message : err.message});
  }
}

// API TO TOGGLE ROOM AVAILABILITY
export const toggleRoomAvailability = async (req , res) =>{
  try{
    const {roomId} = req.body;
    const roomData = await Room.findById(roomId);

    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.json({success : true , message : "Room availability updated successfully"});
  }catch(err){
    res.json({success : false , message : err.message});
  }
}