import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import SignIn from './pages/SignIn'
import DataProvider from "./utils/Context/DataProvider";
import OptionsProvider from "./utils/Context/OptionsProvider";

const CustomRouter = () => {
  return (
    <BrowserRouter>
        <DataProvider>
          <OptionsProvider>
              <Routes>
                  <Route path='/login' element={<SignIn />} />
                  <Route path='/' Component={Layout}>
                      <Route path='user' element={<>skajdsal</>} />
                  </Route>
              </Routes>
          </OptionsProvider>
        </DataProvider>
    </BrowserRouter>
  )
}

export default CustomRouter
