import React from 'react'
import UserMenu from '../components/UserMenu'
import { IoClose } from "react-icons/io5";
import Header from "../components/Header"
import Footer from "../components/Footer"

const UserMenuMobile = () => {
  return (
    <>
    <Header/>
    <section className='bg-white h-full w-full py-2'>
        <button onClick={()=>window.history.back()} className='text-neutral-800 block w-fit ml-auto'>
          <IoClose size={25}/>
        </button>
        <div className='container mx-auto px-3 pb-8'>
           <UserMenu/>
        </div>
    </section>
    <Footer/>
    </>
  )
}

export default UserMenuMobile