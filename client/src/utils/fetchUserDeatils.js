import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

const fetchUserDetails = async () => {
  try {
    const accessToken = localStorage.getItem("accesstoken");
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}user/user-details`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("response login page", response);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export default fetchUserDetails;
