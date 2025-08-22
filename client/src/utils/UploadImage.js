import axios from "axios"
const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('image', image);

    const authToken = localStorage.getItem('accesstoken');
    if (!authToken) {
        throw new Error("Authentication token not found. Please log in.");
    }

    // Return the response
    return await axios.post(/file/upload", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authToken}` 
        },
    });
};

export default uploadImage