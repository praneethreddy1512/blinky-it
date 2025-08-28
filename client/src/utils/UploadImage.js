import axios from "axios"
const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('image', image);

    const authToken = localStorage.getItem('accesstoken');
    if (!authToken) {
        throw new Error("Authentication token not found. Please log in.");
    }

    // Return the respons
    return await axios.post(`${import.meta.env.VITE_API_URL}file/upload`, formData, {

        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authToken}` 
        },
    });
};

export default uploadImage
