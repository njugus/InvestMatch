import Investor from '../../Models/Investor.model.js'
import authMiddleware from '../../Auth/authmiddleware.js'

//create an investor's profile
 
const investorProfile = async(req, res) => {
    try{
        //destructure the details from the req.body
        const { Name, Mission, Vision, Preferences } = req.body

        //get access to the token to generate UserID
        const UserID = req.user.UserID;

    

        


    }catch(error){
        //
    }
}

export default investorProfile;
