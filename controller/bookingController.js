import Booking from "../models/Booking"
import Room from "../models/Room";

// function to check Availablity of room 
const checkAvailability = async ({checkInDate , checkOutDate , room}) =>{
    try{
      const booking = await Booking.find({
        room,
        checkInDate : {$lte : checkOutDate}, //less than or equal to
        checkOutDate : {$gte : checkInDate}, //greater than or equal to
      });
      const isAvalable = booking.length === 0;
      return isAvalable;
    }catch(err) {
       console.error(err.message);
    }
}

// API TO CHECK availability of room
// POST / api/booking/check-availability
export const checkAvailabilityAPI = async (req , res) =>{
   try{
    const {room ,  checkInDate , checkOutDate} = req.body;
    const isAvailable = await checkAvailability({checkInDate , checkOutDate , room});
    res.json({success : true , isAvailable});
   }catch(err){
     res.json({success : false , message : err.message});
   }
}

// API TO CREATE A NEW BOOKING
// POST /API/BOOKING/BOOK

export const createBooking = async(req , res) =>{
    try{
     const {room , checkInDate , checkOutDate , guests} = req.body;
     const user =  req.user._id;
      
    //  before booking check availability
     const isAvailable = await checkAvailability({checkInDate , checkOutDate , room});

     if(!isAvailable) return res.json({success : false , message : "Room is not available for the selected dates"});

    //  get totalPrice from room
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    // calculate totalPrice based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights; 

    // create booking
    const booking = await Booking.create({
        user,
        room,
        
        hotel : roomData.hotel._id,
        guests : +guests,
        checkInDate,
        checkOutDate,
        totalPrice,
    })
     res.json({success : true , message : "Booking created successfully" , booking});
    }catch(err){
        console.log(err.message);
      res.json({success : false , message : "Failed to create booking"});

    }
}