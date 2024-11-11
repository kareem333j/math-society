import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import GroupIcon from '@mui/icons-material/Group';
import './sidebar.css';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export const Sidebar = () => {
    const listItems = useRef();
    const [sidebarState, setSidebarState] = useState({ maximize: false, hide: true });
    const [sidebarFocusedOn, setSidebarFocusedOn] = useLocalStorage('sidebar', 'courses');
    const location = useLocation();

    const handleMenuBtn = () => {
        setSidebarState({
            ...sidebarState,
            maximize: !sidebarState.maximize,
        });
        let sidebar = document.getElementById('dash-sidebar');

        if (sidebarState.maximize === true) {
            sidebar.style = 'width: 250px';
        } else {
            sidebar.style = 'width: 55px';
        }
    }

    const handleHideMenuBtn = () => {
        let sidebar = document.getElementById('dash-sidebar');
        let hideBtn = document.getElementById('arrowHide');

        if (sidebarState.hide === true) {
            sidebar.style = 'width: 55px;right: -55px';
            hideBtn.style = 'transform: rotate(180deg)';
        } else {
            sidebar.style = 'width: 250px;right: 20px';
            hideBtn.style = 'transform: rotate(360deg)';
        }
        setSidebarState({
            ...sidebarState,
            hide: !sidebarState.hide,
        });
    }
    useEffect(() => {
        let items = listItems.current.children;
        if (location.pathname === '/admin/dashboard' || location.pathname === '/admin/dashboard/') {
            [...items].map((ee) => {
                return ee.classList.remove('active');
            });
            items[0].classList.toggle('active');
            setSidebarFocusedOn(items[0].children[0].getAttribute('data-focus'));
        }
    }, [location,sidebarFocusedOn]);

    useEffect(() => {
        let items = listItems.current.children;

        [...items].map((item) => {
            let focus = item.children[0];
            if (focus.getAttribute('data-focus') === sidebarFocusedOn) {
                focus.parentElement.classList.add('active');
                // focus.click();
            }
            return (
                item.addEventListener('click', (e) => {
                    [...items].map((ee) => {
                        return ee.classList.remove('active');
                    });
                    e.target.parentElement.classList.toggle('active');
                    setSidebarFocusedOn(e.target.getAttribute('data-focus'));
                })
            )
        });
    }, [listItems]);

    const handleItemClick = (e) => {
        console.log(e.target);
        e.target.classList.toggle('active');
    }
    return (
        <>
            <div dir='rtl' id='dash-sidebar' className='dash-sidebar'>
                <div className='arrowHide' id='arrowHide' onClick={handleHideMenuBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z" /></svg>
                </div>
                <div className='w-100 d-flex justify-content-center align-items-center overflow-hidden flex-column'>
                    <h3 className='title d-flex gap-3 align-items-center'>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenuBtn}
                        >
                            <MenuIcon />
                        </IconButton>

                        قاعدة التحكم
                    </h3>
                    <div ref={listItems} className='list-items d-flex w-100 flex-column justify-content-center align-items-center'>
                        <Link to='courses' className='item d-flex'>
                            <div className='focus' data-focus='courses'></div>
                            <div className='content d-flex'>
                                <div className='w-100 d-flex gap-2 align-items-center'>
                                    <div className='icon'>
                                        <SchoolIcon />
                                    </div>
                                    الكورسات
                                </div>
                                
                            </div>
                        </Link>
                        <Link to='payments' className='item d-flex position-relative'>
                            <div className='focus' data-focus='payments'></div>
                            <div className='content d-flex'>
                                <div className='w-100 d-flex gap-2 align-items-center'>
                                    <div className='icon'>
                                        <CurrencyExchangeIcon />
                                    </div>
                                    عمليات الدفع
                                </div>
                            </div>
                        </Link>
                        <Link to='users' className='item d-flex position-relative'>
                            <div className='focus' data-focus='users'></div>
                            <div className='content d-flex'>
                                <div className='w-100 d-flex gap-2 align-items-center'>
                                    <div className='icon'>
                                        <GroupIcon />
                                    </div>
                                    المستخدمين
                                </div>
                            </div>
                        </Link>
                        <Link to='notifications' className='item d-flex position-relative'>
                            <div className='focus' data-focus='notifications'></div>
                            <div className='content d-flex'>
                                <div className='w-100 d-flex gap-2 align-items-center'>
                                    <div className='icon'>
                                        <NotificationsActiveIcon />
                                    </div>
                                    الإشعارات
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}