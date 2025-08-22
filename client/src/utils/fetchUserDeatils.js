import axios from "axios";

const fetchUserDetails = async () => {
  try {
    const accessToken = localStorage.getItem('accesstoken');
    const response = await axios.get(
      "https://blinkyit.onrender.com/api/user/user-details",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export default fetchUserDetails;
