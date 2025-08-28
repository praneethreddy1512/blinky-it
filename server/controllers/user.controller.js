import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { request } from "express";
import { success, z } from "zod";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import genertedRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageClodinary from "../utils/uploadimageclodinary.js";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUserController(req, res) {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors | ""?.map((e) => e.message).join(", "),
        err: true,
        success: false,
      });
    }

    const { name, email, password } = parsed.data;

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.status(409).json({
        message: "Email already registered",
        err: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
      err: false,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      err: true,
      success: false,
    });
  }
}

export async function logincontroller(req, res) {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({
        message: "User is not registered",
        err: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "contact to Admin",
        err: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "check your password",
        err: true,
        success: false,
      });
    }
    const accesstoken = await generatedAccessToken(user._id);
    const refreshToken = await genertedRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date(),
    });

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accesstoken, cookiesOption);
    res.cookie("refreshToken", accesstoken, cookiesOption);

    return res.json({
      message: "Login Successfully",
      success: true,
      err: false,
      data: {
        accesstoken,
        refreshToken,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      err: true,
      success: false,
    });
  }
}

export async function logoutcontroller(req, res) {
  try {
    const userid = req.userId;

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return res.json({
      message: "Logout successfully",
      err: false,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      err: true,
      success: false,
    });
  }
}

export async function uploadAvatar(req, res) {
  try {
    const userId = req.userId;

    const image = req.file;

    const upload = await uploadImageClodinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });

    return res.json({
      meassage: "upload profile",
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      err: true,
      success: false,
    });
  }
}

export async function updateUserDetails(req, res) {
  try {
    const userId = req.userId;
    const { name, email, password, mobile } = req.body;

    let hashedPassword = "";

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(password, salt);
    }

    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(mobile && { mobile }),
        ...(password && { password: hashedPassword }),
      }
    );

    return res.json({
      message: "updated user successfully",
      err: false,
      success: true,
      data: updateUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      err: true,
      success: false,
    });
  }
}

export async function refreshToken(req, res) {
  try {
    const refreshToken =
      req.cookies?.refreshToken ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid Token",
        err: true,
        success: false,
      });
    }

    const verifytoken = await jwt.verify(
      refreshToken,
      process.env.JWT_TOKEN_REFRESH
    );

    if (!verifytoken) {
      return res.status(401).json({
        meassage: "token",
        err: true,
        success: false,
      });
    }

    const userId = verifytoken?._id;

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    const newAcessToken = await generatedAccessToken(userId);

    res.cookie("accessToken", newAcessToken, cookiesOption);

    return res.json({
      meassage: "New access token genarated",
      err: false,
      success: true,
      data: {
        newAcessToken,
      },
    });
  } catch (err) {
    return res.status(500).json({
      meassage: err.meassage || err,
      err: true,
      success: false,
    });
  }
}

export async function userDetails(request, response) {
  try {
    const userId = request.userId;

    console.log(userId);
    if (!request.userId) {
      return response.status(401).json({
        message: "Unauthorized: No user ID found",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );

    return response.json({
      message: "user details",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Something is wrong",
      error: true,
      success: false,
    });
  }
}
