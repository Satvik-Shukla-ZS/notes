import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCookieByName } from '../utils/cookie';
import { ContentProvider } from '../utils/context/Content';
import { PageIdProvider } from '../utils/context/PageId';

const Layout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!getCookieByName('token')) {
            navigate('/login');
        }
    }, []);

    if (!getCookieByName('token')) {
        return <></>;
    }

    return (
        <ContentProvider>
            <PageIdProvider>
              <div className='flex w-full'>
                  <Sidebar />
                  <div className='flex flex-col gap-2 w-full'>
                      <Navbar />
                      <Outlet />
                  </div>
              </div>
            </PageIdProvider>
        </ContentProvider>
    );
};

export default Layout;
