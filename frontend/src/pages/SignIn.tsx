import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google'
import {useNavigate} from "react-router-dom";

const SignIn = () => {
  const CLIENT_ID = process.env.REACT_APP_OAUTH_CLIENT_TOKEN
  const navigate = useNavigate()

  return (
    <>
      <center className='flex justify-start text-3xl p-2'>NoteBlock </center>
      <section className='mt-36 m-20 border shadow shadow-slate-700 p-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-20'>
          <div className='h-full w-full'>
            <img
              className='mx-auto h-full w-full rounded-md object-cover'
              src='https://img.freepik.com/free-vector/flat-hand-drawn-dual-team-coworking-space_23-2148832031.jpg?t=st=1723466141~exp=1723469741~hmac=a60c1bad0f9da0aef92822e88c1efdef1c48edfe23105653459d9727716dcedd&w=1800'
              alt=''
            />
          </div>
          <div className='flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24 rounded-xl '>
            <div className='xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md'>
              <h2 className='text-3xl font-bold leading-tight text-black sm:text-4xl m-4'>Sign In</h2>
              <div className='w-96'>
                <GoogleOAuthProvider clientId={CLIENT_ID ?? ''}>
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      document.cookie = `token=${credentialResponse.credential}`
                      navigate("/")
                    }}
                    onError={() => {
                      console.log('Login Failed')
                    }}
                  />
                </GoogleOAuthProvider>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default SignIn
