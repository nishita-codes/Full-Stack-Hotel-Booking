// GET / API / USER

export const getUserData = async (req , res )=>{
    try{
      const role = req.user.role;
      const recentSearchCities = req.user.recentSearchedCities;
      res.json({success:true, role , recentSearcedCities})
    }catch(err){
      res.json({success:false , message : err.message})
    }
} 



// store user recent searched cities
export const storeUserSearchCities = async (req , res) =>{
    try{
        const {recentSearchedCity} = req.body;
        const user = await req.user;
        if(user.recentSearcedCities.length < 3){
            user.recentSearcedCities.push(recentSearchedCity);
        }else{
            user.recentSearcedCities.shift();
            user.recentSearcedCities.push(recentSearchedCity);  
        }
        await user.save();
        res.json({success:true ,message : "City added" })
    }
    catch(err){
      res.json({success :false , message:err.message})
    }
}