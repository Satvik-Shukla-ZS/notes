import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import SignIn from './pages/SignIn'
import Content from './pages/Content';

const CustomRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<SignIn />} />
        <Route path='/' Component={Layout}>
          <Route path={"/page/:id"} element={<Content />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default CustomRouter
