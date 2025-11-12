import User from "../models/user.js";
import { Webhook } from "svix";  //A webhook is a way for one application to automatically send real-time data to another when something happens.   

const clerkWebhooks = async (req , res) => {
    try{
        // create a svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // getting headers
        const headers = {
            "svix-id" : req.headers["svix-id"],
            "svix-timestamp" : req.headers["svix-timestamp"],
            "svix-signature" : req.headers["svix-signature"],
        };

        // verify the webhook
        await whook.verify(JSON.stringify(req.body) , headers);

        //  getting data from request body
        const {type , data} = req.body;

        const userData = {
            _id: data.id,
            username : data.first_name + " " + data.last_name,
            email : data.email_addresses[0].email_address,
            image : data.profile_image_url, 
        }

        // switch case for different events
        switch(type){
            case "user.created":
                // create a new user in the database
                {
                    await User.create(userData);
                    break;
                }

                case "user.updated":
                // cupdate a new user in the database
                {
                    await User.findByIdAndUpdate(data.id , userData);
                    break;
                }


                case "user.deleted":
                // delet a new user in the database
                {
                    await User.findByIdAndDelete(data.id);
                    break;
                }

                default:
                    break;
        }
        res.json({success:true , message:"webhooks Received"});
    }catch(err){
        console.log(err.message);
        res.json({success:false , message:err.message});
    }
}

export default clerkWebhooks;