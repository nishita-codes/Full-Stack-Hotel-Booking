import Booking from "../models/Booking"
import Hotel from "../models/Hotel";
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
};

// API TO GET ALL BOOKING FOR A USER
// GET /api/booking/user

export const getUserBooking = async(req , res) =>{
    try {
        const user = req.use._id;
        const bookings = (await Booking.find({user}).populate("room hotel")).sort({createdAt : -1})
        res.json({success :true , bookings});
    } catch (err) {
        res.json({success : false , message : "Failed to fetch bookings"});
    }
};

// API TO GET ALL BOOKINGS FOR A HOTEL OWNER
export const getOwnerBookings = async(req , res) =>{
    try{
    const hotel = await Hotel.fondOne({owner : req.auth.userId});
    if(!hotel){
        return res.json({success : false , message : "No Hotel Found"});

    }
    const bookings = await Booking.find({hotel : hotel._id}).populate("room hotel user").sort({createdAt : -1});
    // TOTAL BOOKINGS
    const totalBookings = bookings.length;
    // TOTAL REVENEUE 
    const totalRevenue = bookings.reduce((acc , booking) => acc + booking.totalPrice,0);

    res.json({success : true , dashboardData : {totalBookings , totalRevenue , bookings}});
} catch(err){
    res.json({success :false , message : "fail to add bookings"});
}
}