import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import SignIn from './pages/SignIn'
import DataProvider from "./utils/Context/DataProvider";
import OptionsProvider from "./utils/Context/OptionsProvider";
import PageViewer from "./pages/PageViewer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const CustomRouter = () => {
    return (
        <BrowserRouter>
            <DataProvider>
                <OptionsProvider>
                    <Routes>
                        <Route path='/login' element={<SignIn/>}/>
                        <Route path='/' Component={Layout}>
                            <Route path='/' element={<Home/>}/>
                            <Route path=':collId/:pageId/' element={<PageViewer/>}/>
                        </Route>
                        <Route path='*' element={<NotFound/>}/>
                    </Routes>
                </OptionsProvider>
            </DataProvider>
        </BrowserRouter>
    );
}

export default CustomRouter
