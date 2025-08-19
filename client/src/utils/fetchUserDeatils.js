import axios from "axios";

const fetchUserDetails = async () => {
  try {
    const accessToken = localStorage.getItem('accesstoken');
    const response = await axios.get(
      "http://localhost:8800/api/user/user-details",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export default fetchUserDetails;
