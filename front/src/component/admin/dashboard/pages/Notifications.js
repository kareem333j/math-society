import { enqueueSnackbar } from "notistack";
import { useState, useEffect, useContext } from "react";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LoadingGradient from "../../../loading/Loading2";
import { Link } from "react-router-dom";
import { Button, IconButton, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import AddIcon from '@mui/icons-material/Add';
import DialogScreen from "../inherit/Dialog";
import { AddNotification } from "./notifications-pages/Add";
import axiosInstance from "../../../../Axios";
import { NotificationContext } from "../../../../context/NotificationsContext";
import { EditNotification } from "./notifications-pages/Edit";


export default function NotificationsAdmin(props) {
    const dataAuth = props.dataAuth.profile;
    const notificationsContext = useContext(NotificationContext);
    const notifications = notificationsContext.notifications;
    const [currentNotificationClicked, setCurrentNotificationClicked] = useState(0);
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal, open } = state;
    const handleClickVariant = (variant, msg) => {
        enqueueSnackbar(msg, { variant: variant, anchorOrigin: { vertical, horizontal } });
    }
    const [error, setError] = useState(false);
    const [openAddNotification, setOpenAddNotification] = useState(false);
    const [openUpdateNotification, setOpenUpdateNotification] = useState(false);
    const handleClickOpen = (type) => {
        if (type === 'add_notification') {
            setOpenAddNotification(true);
        }
        else if (type === 'edit_notification') {
            setOpenUpdateNotification(true);
        }
    };

    useEffect(() => {
        getAllNotifications();
    }, [])

    const dateFormatter = (value) => {
        let date = new Date(value);

        let newDate =
            new Intl.DateTimeFormat('ar-GB', {
                dateStyle: 'full',
                // timeStyle: 'short',
                timeZone: 'Africa/Cairo',
            }).format(date)


        return newDate
    }

    const getAllNotifications = () => {
        setLoading(true);
        axiosInstance
            .get('admin/notifications')
            .then((response) => {
                setLoading(false);
                notificationsContext.setNotifications(response.data);
            })
            .catch((error) => {
                setLoading(false);
                setError(true);
            });
    }

    const deleteNotification = (id) => {
        setLoading(true);
        axiosInstance
            .delete(`admin/notifications/${id}/delete`)
            .then(() => {
                setLoading(false);
                handleClickVariant('success', 'تم حذف الإشعار بنجاح');
                getAllNotifications();
            })
            .catch(() => {
                setLoading(false);
                handleClickVariant('error', 'لقد حدث خطأ')
            });
    }

    const handleDeleteBtn = (id) => {
        withReactContent(Swal).fire({
            title: "! حذف ",
            text: "هل انت متأكد من حذف هذا الإشعار",
            icon: "question",
            cancelButtonText: "إلغاء",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "نعم, حذف",
        }).then((response) => {
            if (response.isConfirmed) {
                deleteNotification(id);
            }
        });
    }

    if (loading === true) {
        return (
            <LoadingGradient />
        )
    } else {
        return (
            <div className="notifications w-100">
                <>
                    <DialogScreen close_title='إرسال إشعار جديد' data_theme={props.data_theme} open={openAddNotification} setOpen={setOpenAddNotification} component={AddNotification} />
                    <DialogScreen id={currentNotificationClicked} close_title='تعديل الإشعار' data_theme={props.data_theme} open={openUpdateNotification} setOpen={setOpenUpdateNotification} component={EditNotification} />
                </>
                <div className='w-100 d-flex align-items-center gap-2 mb-4 justify-content-between'>
                    <div className="page-title d-flex align-items-center gap-2">
                        <NotificationsActiveIcon />
                        الإشعارات
                    </div>
                    <div>
                        <Button onClick={() => handleClickOpen('add_notification')} dir='ltr' id='admin-main-btn1' variant="contained" sx={{ 'fontWeight': 'bold' }} size='medium'>
                            <AddIcon />
                        </Button>
                    </div>
                </div>
                {
                    (error) ?
                        <div style={{ 'minHeight': '50vh' }} className="w-100 d-flex justify-content-center align-items-center">
                            <h3 style={{ 'color': 'var(--red1', 'fontSize': '1.7em' }} className="w-100 d-flex justify-content-center align-items-center">
                                لقد حدث خطأ.!
                            </h3>
                        </div>
                        :
                        (notifications == null || (notifications != null && notifications.length <= 0)) ?
                            <div style={{ 'minHeight': '50vh' }} className="w-100 d-flex justify-content-center align-items-center">
                                <h3 style={{ 'color': 'var(--text-cyan-700', 'fontSize': '1.7em' }} className="w-100 d-flex justify-content-center align-items-center">
                                    لا يوجد اي إشعار حتي الأن.!
                                </h3>
                            </div>
                            :

                            <div className='area-table w-100'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th className='td-id'>#</th>
                                            <th className='head'><span>العنوان</span></th>
                                            <th className='head'><span>المحتوي</span></th>
                                            <th className='head'><span>تاريخ الإنشاء</span></th>
                                            <th className='head'><span>من</span></th>
                                            <th className='head'><span>الي</span></th>
                                            <th className='head'><span>عدد المرسل اليهم ولم يحذفو الإشعار</span></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            notifications.map((notification, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td className='td-id'>{notification.id}</td>
                                                        <td>{notification.title}</td>
                                                        <td>
                                                            {
                                                                (notification.context.length > 60) ?
                                                                    `${notification.context.substring(0, 60)}...`
                                                                    :
                                                                    notification.context
                                                            }
                                                        </td>
                                                        <td>{dateFormatter(notification.created_dt)}</td>
                                                        <td>
                                                            {
                                                                (notification.transmission.from_user.id != null) ?
                                                                    <Link style={{ 'color': 'var(--red-light)' }} to={`/user/${notification.transmission.from_user.id}/profile`}>
                                                                        {notification.transmission.from_user.name}
                                                                    </Link>
                                                                    :
                                                                    'غير معروف'
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                (notification.transmission.to_user.id != null) ?
                                                                    <Link style={{ 'color': 'var(--red-light)' }} to={`/user/${notification.transmission.to_user.id}/profile`}>
                                                                        {notification.transmission.to_user.name}
                                                                    </Link>
                                                                    :
                                                                    'الجميع'
                                                            }
                                                        </td>
                                                        <td>x{notification.sended_count}</td>
                                                        <td>
                                                            {
                                                                (dataAuth.id === notification.transmission.from_user.id || dataAuth.profile.is_superuser) ?
                                                                    <div className='d-flex gap-4 px-3'>
                                                                        <Tooltip title="تعديل">
                                                                            <IconButton
                                                                                size="large"
                                                                                edge="start"
                                                                                color="inherit"
                                                                                aria-label="edit"
                                                                                className='custom-edit-button options-btn'
                                                                                onClick={() => {
                                                                                    handleClickOpen('edit_notification');
                                                                                    setCurrentNotificationClicked(notification.id);
                                                                                }
                                                                                }
                                                                            >
                                                                                <EditIcon />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="حذف">
                                                                            <IconButton
                                                                                size="large"
                                                                                edge="start"
                                                                                color="inherit"
                                                                                aria-label="delete"
                                                                                className='custom-delete-button options-btn'
                                                                                onClick={() => { handleDeleteBtn(notification.id) }}
                                                                            >
                                                                                <DeleteIcon />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </div>
                                                                    :
                                                                    <></>
                                                            }

                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                }
            </div>
        )
    }
}