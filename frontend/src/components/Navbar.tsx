import React, { useEffect, useState } from 'react'
import USER_API from '../utils/api/user'
import { RES_USER_PROFILE } from '../utils/types/api/user'
import { googleLogout } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import logout from '../assets/img/logout.png'
import data from './data'
import { RiLogoutCircleLine } from 'react-icons/ri'

const Navbar = () => {
  const [profile, setProfile] = useState<RES_USER_PROFILE>()
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      const response = await USER_API.GET_PROFILE()
      setTimeout(() => {
        setProfile(response.data)
      }, 1000)
    })()
  }, [])

  const handleLogout = () => {
    document.cookie = `token=""`
    navigate('/login')
  }

  return (
    <>
      <nav className='w-full px-2 py-4 flex justify-between'>
        <input type='text' className='w-40 px-4 rounded-md p-2 border-slate-400 border-2' placeholder='Search Notes' />
        <div className='flex flex-row lg:gap-4 max-md:gap-4 md:gap-4 max-sm:gap-2'>
          <div className='flex flex-row gap-2 items-center justify-center'>
            <img src={profile?.profile} className='rounded-full w-14 h-14 border-2 ' alt='pfp' />
            <h1>{profile ? profile.name : ''}</h1>
            <RiLogoutCircleLine className='text-2xl cursor-pointer ' />
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
