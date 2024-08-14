import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google'
import gif from '../assets/img/Mobile login.gif'

const SignIn = () => {
  const CLIENT_ID = process.env.REACT_APP_OAUTH_CLIENT_TOKEN
  console.log(CLIENT_ID)

  return (
    <>
      <center className='flex justify-start text-3xl p-2 '>NoteBlock </center>
      <section>
        <div className='grid grid-cols-1 lg:grid-cols-2 m-6 mt-20 shadow shadow-slate-300 m-32'>
          <div className='flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24'>
            <div className='xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md'>
              <h2 className='text-3xl font-bold leading-tight text-black sm:text-4xl '>Sign in</h2>
              <div className='mt-3 space-y-3'>
                <div className='w-96'>
                  <GoogleOAuthProvider clientId={CLIENT_ID ?? ''}>
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        console.log(credentialResponse)
                        document.cookie = `token=${credentialResponse.credential}`
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
          <div className='h-full'>
            <img className='mx-auto h-full w-full rounded-md object-cover' src={gif} alt='' />
          </div>
        </div>
      </section>
    </>
  )
}

export default SignIn
