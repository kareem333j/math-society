import { Container } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import axiosInstance from "../Axios";
import { useContext, useEffect, useState } from "react";
import './notification.css';
import LoadingGradient from "../component/loading/Loading2";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Avatar } from "antd";
import { GiLayeredArmor } from "react-icons/gi";
import StarIcon from '@mui/icons-material/Star';
import { AuthContext } from "../context/AuthContext";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { enqueueSnackbar } from "notistack";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";


const HtmlContent = ({ htmlString }) => {
    return (
        <div
            dangerouslySetInnerHTML={{ __html: htmlString }}
        />
    );
};


export const NotificationPage = () => {
    const params = useParams();
    const notification_id = params.notification_id;
    const [loading, setLoading] = useState(true);
    const history = useNavigate();
    const [notification, setNotification] = useState(null);
    const userData = useContext(AuthContext);
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal, open } = state;
    const handleClickVariant = (variant, msg) => {
        enqueueSnackbar(msg, { variant: variant, anchorOrigin: { vertical, horizontal } });
    }

    useEffect(() => {
        getNotification();
        sendSeenNotification();
    }, [notification_id]);

    const dateFormatter = (value) => {
        let date = new Date(value);

        let newDate =
            new Intl.DateTimeFormat('ar-GB', {
                dateStyle: 'full',
                timeZone: 'Africa/Cairo',
            }).format(date)


        return newDate
    }

    const getNotification = () => {
        setLoading(true);
        axiosInstance
            .get(`/notifications/${notification_id}`)
            .then((response) => {
                setLoading(false);
                setNotification(response.data);
            })
            .catch(() => {
                setLoading(false);
                history('/');
            })
    }

    const deleteNotification = () => {
        axiosInstance
            .delete(`notifications/${notification_id}/delete`)
            .then(() => {
                history('/');
            }).catch(() => {
                handleClickVariant('error', 'هناك خطأ ما قد حدث');
            });
    }

    const handleDeleteBtn = (props) => {
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
                deleteNotification();
            }
        });
    }

    const sendSeenNotification = () => {
        setLoading(true);
        axiosInstance
            .put(`/notifications/${notification_id}/seen`, { seen: true })
            .then((response) => {
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                history('/');
            })
    }

    if (loading === true) {
        return (
            <LoadingGradient />
        )
    } else {
        if (notification != null) {
            return (
                <>
                    <section className="notification-page sec1" dir="rtl">
                        <Container className="d-flex flex-column">
                            <div className="w-100 title d-flex justify-content-start align-items-center mb-3 gap-2">
                                <NotificationsActiveIcon />
                                <span>الإشعارات</span>
                            </div>
                            <div className="main-box item mb-3">
                                <div className="notification-head d-flex flex-row gap-2 justify-content-start align-items-center mb-3">
                                    <div>
                                        <Avatar style={{ 'width': '70px', 'height': '70px', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }} size={'large'} alt="Remy Sharp">

                                            {
                                                (notification.notification_data.is_superuser) ?
                                                    <StarIcon style={{ 'width': '30px', 'height': '30px' }} />
                                                    :
                                                    (notification.notification_data.is_staff) ?
                                                        <GiLayeredArmor style={{ 'width': '30px', 'height': '30px' }} />
                                                        :
                                                        <GiLayeredArmor style={{ 'width': '30px', 'height': '30px' }} />
                                            }
                                        </Avatar>
                                    </div>
                                    <div className="d-flex justify-content-center align-items-start flex-column">
                                        <h4 className="sended-username">
                                            {
                                                (notification.notification_data.is_superuser) ?
                                                    notification.notification_data.from
                                                    :
                                                    (notification.notification_data.is_staff) ?
                                                        'الدعم'
                                                        :
                                                        'الدعم'
                                            }
                                        </h4>
                                        <p className="p-0 m-0 gap-1 to-user" style={{ 'color': 'var(--color-default-50)' }}>الي: <span style={{ 'color': 'var(--green-light)' }}>{
                                            (userData.dataProfile.isAuthenticated != null) ?
                                                `${userData.dataProfile.profile.first_name} ${userData.dataProfile.profile.last_name}`
                                                :
                                                ''
                                        }</span></p>
                                    </div>
                                </div>
                                <div className="notification-date w-100 p-2">
                                    {dateFormatter(notification.notification_data.created_dt)}
                                </div>
                                <div className="notification-title p-2">
                                    <p id='notification-context' className="w-100 d-flex">
                                        <span style={{ "whiteSpace": "pre-line" }}>{notification.notification_data.title}</span>
                                    </p>
                                </div>
                                <div className="notification-context p-2">
                                    <p id='notification-context' className="w-100 d-flex">
                                        <span style={{ "whiteSpace": "pre-line" }}><HtmlContent htmlString={notification.notification_data.context} /></span>
                                    </p>
                                </div>

                                {
                                    (notification.seen) ?
                                        <span style={{ 'color': 'var(--green-light)' }} dir="ltr">تمت المشاهدة  <DoneAllIcon sx={{ width: '15px', height: '15px' }} /></span>
                                        :
                                        <span style={{ 'color': 'var(--color-default-50)' }} dir="ltr">لم تشاهد <DoneAllIcon sx={{ width: '15px', height: '15px' }} /></span>
                                }
                            </div>
                            <div className="action w-100">
                                <Button onClick={handleDeleteBtn} className="d-flex gap-2" sx={{ marginBottom: 1, fontSize: '1.1em', letterSpacing: '1px' }} color='error' variant="contained"><DeleteIcon /> حذف</Button>
                            </div>
                        </Container>
                    </section>
                </>
            )
        }else{
            <></>
        }
    }
}