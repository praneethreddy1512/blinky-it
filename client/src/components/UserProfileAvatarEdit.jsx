import React, { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { updatedAvatar } from '../store/userslice'
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import toast from 'react-hot-toast';

const UserProfileAvatarEdit = ({close}) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(false)

    const handleSubmit = (e)=>{
        e.preventDefault()
    }

    const handleUploadAvatarImage = async(e)=>{
        const file = e.target.files[0]

        if(!file){
            return
        }

        const formData = new FormData()
        formData.append('avatar',file)

        try {
            setLoading(true)
            const response = await axios.put(
                "https://blinkyit.onrender.com/api/user/upload-avatar",
                formData,
                {
                headers :{
                 Authorization: `Bearer ${localStorage.getItem('accesstoken')}`
                }
            }
            )
            const { data : responseData}  = response

            dispatch(updatedAvatar(responseData.data.avatar))

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload avatar")
        } finally{
            setLoading(false)
        }

    }
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-100 bg-opacity-70 p-4 flex items-center justify-center'>
        <div className='bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center'>
            <button onClick={close} className='text-neutral-800 w-fit block ml-auto'>
                <IoClose size={20}/>
            </button>
            <div className='w-20 h-20 bg-transparent
             flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
                {
                    user.avatar ? (
                        <img 
                        alt={user.name}
                        src={user.avatar}
                        className='w-full h-full'
                        />
                    ) : (
                        <FaRegUserCircle size={65}/>
                    )
                }
            </div>
            <form onSubmit={handleSubmit}>
                <label htmlFor='uploadProfile'>
                    <div className='border border-yellow-400 hover:text-white cursor-pointer hover:bg-yellow-400 px-4 py-1 rounded text-sm my-3'>
                        {
                            loading ? "Loading..." : "Upload"
                        }
                    </div>
                    <input onChange={handleUploadAvatarImage} type='file' id='uploadProfile' className='hidden'/>
                </label>
            </form>
            
        </div>
    </section>
  )
}

export default UserProfileAvatarEdit