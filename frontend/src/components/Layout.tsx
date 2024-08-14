import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import { getCookieByName } from '../utils/cookie'
import USER_API from '../utils/api/user'

const Layout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!getCookieByName('token')) {
      navigate('/login')
    } else {
      ;(async () => {
        const response = await USER_API.GET_PROFILE()
        console.log(response)
      })()
    }
  }, [navigate])

  if (!getCookieByName('token')) {
    return <></>
  }

  return (
    <>
      <div className='flex w-full'>
        <Sidebar />
        <div className='flex flex-col gap-2 w-full bg-slate-100'>
          <Navbar />
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Layout
