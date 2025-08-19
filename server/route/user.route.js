import { Router } from "express";
import { logoutcontroller, refreshToken, registerUserController, updateUserDetails, uploadAvatar,logincontroller,userDetails } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userrouter = Router()

userrouter.post("/register", registerUserController);
userrouter.post('/login',logincontroller)
userrouter.post('/logout',auth,logoutcontroller) 
userrouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatar)
userrouter.put('/update-user',auth,updateUserDetails)
userrouter.post("/refresh-token",refreshToken)
userrouter.get('/user-details',auth,userDetails)

export default userrouter