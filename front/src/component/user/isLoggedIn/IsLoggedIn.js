import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import './isLoggedIn.css';
import { Logout } from "@mui/icons-material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import CottageIcon from '@mui/icons-material/Cottage';
import { HashLink } from 'react-router-hash-link';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { Notifications } from './NotificationBtn';



let settings = {
    'dashboard': {
        name: 'قاعدة التحكم',
        link: '/admin/dashboard',
    },
    'logout': {
        name: 'تسجيل الخروج',
        link: '/logout',
    }
};

function IsLoggedIn(props) {
    const dataUser = props.dataUser.profile;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    settings.profile = {
        name: 'الملف الشخصي',
        link: `/user/${dataUser.id}/profile`,
    }


    return (
        <div className={`${props.className} gap-2`}>
            <Notifications data_theme={props.data_theme} dataUser={dataUser} />
            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="الإعدادات">
                    <IconButton onClick={handleClick} sx={{ p: 0, 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }}>
                        <Avatar className='avatar' sx={{ p: 0, 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }} data-content={dataUser.first_name[0].toUpperCase()} alt="Remy Sharp" />
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    data-theme={(props.data_theme === true) ? 'dark' : 'light'}
                    open={open}
                    dir="rtl"
                    onClose={handleClose}
                    onClick={handleClose}
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
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem sx={{ 'padding': '0' }} onClick={handleClose}>
                        <Link style={{ 'color': 'var(--color-default2)', 'gap': '10px', 'width': '200px', 'padding': '5px 0' }} className="d-flex justify-content-start align-items-center" to={`/user/${dataUser.id}/profile`}>
                            <Avatar /> الملف الشخصي
                        </Link>
                    </MenuItem>
                    <Divider />
                    <MenuItem sx={{ 'padding': 0 }} onClick={handleClose}>
                        <Link style={{ 'color': 'var(--color-default2)', 'padding': '5px 15px' }} className="d-flex w-100 justify-content-start align-items-center" to='/'>
                            <ListItemIcon>
                                <CottageIcon fontSize="small" />
                            </ListItemIcon>
                            الرئيسية
                        </Link>
                    </MenuItem>

                    {
                        (dataUser.profile.is_superuser || dataUser.profile.is_staff) ?
                            <MenuItem sx={{ 'padding': 0 }} onClick={handleClose}>
                                <Link style={{ 'color': 'var(--color-default2)', 'padding': '5px 15px' }} className="d-flex w-100 justify-content-start align-items-center" to='/admin/dashboard'>
                                    <ListItemIcon>
                                        <DashboardIcon fontSize="small" />
                                    </ListItemIcon>
                                    قاعدة التحكم
                                </Link>
                            </MenuItem>
                            :
                            <div className="w-100 p-0 m-0">
                                <MenuItem sx={{ 'padding': 0 }} onClick={handleClose}>
                                    <HashLink style={{ 'color': 'var(--color-default2)', 'padding': '5px 15px' }} className="d-flex w-100 justify-content-start align-items-center" to={`/user/${dataUser.id}/profile#courses`} >
                                        <ListItemIcon>
                                            <ImportContactsIcon fontSize="small" />
                                        </ListItemIcon>
                                        كورساتي
                                    </HashLink>
                                </MenuItem>
                                <MenuItem sx={{ 'padding': 0 }} onClick={handleClose}>
                                    <HashLink style={{ 'color': 'var(--color-default2)', 'padding': '5px 15px' }} className="d-flex w-100 justify-content-start align-items-center" to={`/user/${dataUser.id}/profile#invoice`} >
                                        <ListItemIcon>
                                            <ReceiptIcon fontSize="small" />
                                        </ListItemIcon>
                                        فواتير
                                    </HashLink>
                                </MenuItem>
                            </div>
                    }

                    <MenuItem sx={{ 'padding': 0 }} onClick={handleClose}>
                        <Link style={{ 'color': 'var(--color-default2)', 'padding': '5px 15px' }} className="d-flex w-100 justify-content-start align-items-center" to='/logout'>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            تسجيل الخروج
                        </Link>
                    </MenuItem>
                </Menu>
            </Box>
        </div>
    )
};

export default IsLoggedIn;