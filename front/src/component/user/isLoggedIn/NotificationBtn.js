import { Badge, Box, CircularProgress, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, Typography } from "antd";
import axiosInstance from "../../../Axios";
import { GiLayeredArmor } from "react-icons/gi";
import StarIcon from '@mui/icons-material/Star';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { BsDatabaseFillX } from "react-icons/bs";
import { AuthContext } from "../../../context/AuthContext";


export const Notifications = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuId = 'primary-search-account-menu';
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const location = useLocation();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        getNotifications();
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const userData = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [notificationsList, setNotificationsList] = useState([]);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState({ 'count': 0 });

    useEffect(() => {
        if (userData.dataProfile) {
            getUnreadNotificationsCount();
        }
    }, [location.pathname, userData.dataProfile]);

    const getNotifications = () => {
        setLoading(true);
        axiosInstance
            .get('notifications')
            .then((response) => {
                setLoading(false);
                setNotificationsList(response.data);
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    const removeNotifications = () => {
        setLoading(true);
        axiosInstance
            .get('notifications/delete/all')
            .then((response) => {
                setLoading(false);
                getNotifications();
            })
            .catch((error) => {
                setLoading(false);
            });
    }

    const getUnreadNotificationsCount = () => {
        setLoading(true);
        axiosInstance
            .get(`users/${userData.dataProfile.profile.id}/notifications/unread`)
            .then((response) => {
                setLoading(false);
                setUnreadNotificationsCount(response.data);
            })
            .catch((error) => {
                setLoading(false);
            });
    }


    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="الإشعارات">
                <IconButton
                    className="notificationIcon"
                    size="large"
                    aria-label={`show ${unreadNotificationsCount.count} new notifications`}
                    color="inherit"
                    onClick={handleClick}
                >
                    <Badge badgeContent={unreadNotificationsCount.count} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="notification-menu"
                data-theme={(props.data_theme === true) ? 'dark' : 'light'}
                open={open}
                dir="rtl"
                onClose={handleClose}

                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 20,
                                width: 10,
                                height: 10,
                                bgcolor: 'var(--color-dark-1)',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <List className={`notification-list ${(notificationsList.length > 0 && loading === false) ? 'mb-4' : ''}`} dir='rtl' sx={{ width: '100%', paddingTop: 0, paddingBottom: 0, maxWidth: 360, bgcolor: 'var(--color-dark-1)', color: 'var(--color-default2)' }}>
                    {
                        (loading === true) ?
                            <ListItem onClick={handleClose} className='p-0 m-0 px-5 py-2 d-flex justify-content-center align-items-center' sx={{ 'padding': 0 }}>
                                <CircularProgress />
                            </ListItem>
                            :
                            (notificationsList.length <= 0) ?
                                <ListItem style={{ cursor: 'text' }} onClick={handleClose} className='p-0 m-0 px-5 py-2 d-flex justify-content-center align-items-center' sx={{ 'padding': 0 }}>
                                    <BsDatabaseFillX style={{ marginLeft: '5px' }} />  لا توجد لديك إشعارات
                                </ListItem>
                                :
                                notificationsList.reverse().map((notification, i) => {
                                    return (
                                        <ListItem onClick={handleClose} key={i} sx={{ 'padding': 0 }}>
                                            <Link style={(notification.seen) ? { backgroundColor: 'var(--notifications-seen)' } : {}} className="d-flex w-100 notification-item justify-content-between align-items-center px-3 py-2" to={`/notifications/${notification.id}`}>
                                                <ListItemAvatar className="d-flex justify-content-center align-items-center">
                                                    <Avatar alt="Remy Sharp">

                                                        {
                                                            (notification.notification_data.is_superuser) ?
                                                                <StarIcon />
                                                                :
                                                                (notification.notification_data.is_staff) ?
                                                                    <GiLayeredArmor />
                                                                    :
                                                                    <GiLayeredArmor />
                                                        }
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    className='notification-text'
                                                    primary={
                                                        (notification.notification_data.is_superuser) ?
                                                            notification.notification_data.from
                                                            :
                                                            (notification.notification_data.is_staff) ?
                                                                'الدعم'
                                                                :
                                                                'الدعم'
                                                    }
                                                    secondary={
                                                        <>
                                                            <span dir='rtl' className="d-block mb-2" style={{ color: 'var(--color-default-50)' }}>
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    sx={{ color: 'var(--color-default2)', display: 'inline', direction: 'rtl' }}
                                                                >
                                                                    {notification.notification_data.title} -
                                                                </Typography>
                                                                {` ${(notification.notification_data.context.length > 90) ? `${notification.notification_data.context.substring(0, 90)}...` : notification.notification_data.context} `}
                                                            </span>
                                                            {
                                                                (notification.seen) ?
                                                                    <span style={{ 'color': 'var(--green-light)' }} dir="ltr">تمت المشاهدة  <DoneAllIcon sx={{ width: '15px', height: '15px' }} /></span>
                                                                    :
                                                                    <span style={{ 'color': 'var(--color-default-50)' }} dir="ltr">لم تشاهد <DoneAllIcon sx={{ width: '15px', height: '15px' }} /></span>
                                                            }
                                                        </>
                                                    }
                                                />
                                            </Link>

                                        </ListItem>
                                    )
                                })
                    }
                    {
                        (notificationsList.length > 0 && loading === false) ?
                            <div className="options text-end p-1 px-3" style={{ 'backgroundColor': 'var(--color-dark-1)' }}>
                                <button onClick={removeNotifications}>حذف الكل</button>
                            </div>
                            :
                            ''
                    }
                </List>


            </Menu>
        </Box>
    )
}