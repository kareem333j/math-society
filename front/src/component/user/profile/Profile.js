import { Card, Container } from 'react-bootstrap';
import './profile.css';
import '../../admin/dashboard/pages/shared.css';
import { Avatar, Box, Button, CardActionArea, CardActions, CardContent, CardMedia, createTheme, LinearProgress, ThemeProvider, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../../Axios';
import EmailIcon from '@mui/icons-material/Email';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import PersonIcon from '@mui/icons-material/Person';
import 'react-circular-progressbar/dist/styles.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CourseImage from '../../../assets/images/course.jpg';
import { Progress } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BsDatabaseFillX } from "react-icons/bs";
import VerifiedIcon from '@mui/icons-material/Verified';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { RiVipCrown2Fill } from "react-icons/ri";
import StarIcon from '@mui/icons-material/Star';
import { GiLayeredArmor } from "react-icons/gi";
import LoadingGradient from '../../loading/Loading2';
import { AuthContext } from '../../../context/AuthContext';
import { CustomSwitchBtn } from '../../admin/dashboard/inherit/SwitchBtn';
import { DashboardMainBtn } from '../../inherit/DashboardMainBtn';
import { enqueueSnackbar } from 'notistack';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';

const theme = createTheme({
    palette: {
        ochre: {
            main: '#14b8a6',
            light: '#E9DB5D',
            dark: '#A29415',
            contrastText: '#242105',
        },
    },
});

function LinearProgressWithLabel(props) {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress color='ochre' variant="determinate" {...props} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" sx={{ color: 'var(--tw-gradient-from)' }}>
                        {`${Math.round(props.value)}%`}
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>

    );
}

export default function UserProfile(props) {
    const params = useParams();
    const user_id = params.user_id;
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const history = useNavigate();
    const AuthDataContext = useContext(AuthContext);
    const authUser = AuthDataContext.dataProfile;
    const permissionDataInitialState = Object.freeze(
        {
            'is_superuser': false,
            'is_staff': false,
            'is_vip': false,
        }
    );
    const [permissionData, setPermissionData] = useState({ permissionDataInitialState });

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
        getProfile();
    }, [user_id]);

    const getProfile = () => {
        setLoading(true);
        axiosInstance
            .get(`/profile/${user_id}/all`)
            .then((response) => {
                setLoading(false);
                setUserData(response.data);
                setPermissionData({
                    'is_superuser': response.data.profile.is_superuser,
                    'is_staff': response.data.profile.is_staff,
                    'is_vip': response.data.profile.is_vip,
                });
            }).catch(() => {
                setLoading(false);
                history('/');
            });
    }

    const filterUser = (asUser, asGest) => {
        if (loading === false) {
            if (authUser.isAuthenticated != null) {
                if (parseInt(user_id) === parseInt(authUser.profile.id)) {
                    return asUser;
                }
                return asGest;
            }
        }
    }

    const handelPermissionFormChange = (e) => {
        if (e.target.value === "on") {
            e.target.value = "off";
        } else {
            e.target.value = "on";
        }

        setPermissionData({
            ...permissionData,

            [e.target.name]: (e.target.value === "on") ? true : false,
        });
    }

    const updatePermissions = (e) => {
        e.preventDefault();
        setLoading(true);
        axiosInstance
            .put(`/admin/users/${userData.id}/give`, permissionData)
            .then(() => {
                setLoading(false);
                getProfile();
                handleClickVariant('success', 'تم تحديث الحساب بنجاح');
            })
            .catch(() => {
                setLoading(false);
                handleClickVariant('error', 'هناك خطأ ما قد حدث');
            });
    }

    const permissionForm = () => {
        if (loading === false) {
            return (
                <form className='w-100' method='post' onSubmit={updatePermissions}>
                    <div id='courses' className='title d-flex w-100 justify-content-between align-items-center'>
                        <span><ExpandMoreIcon /></span>
                        <span>تعديل</span>
                    </div>
                    <section className='sec d-flex justify-content-center align-items-end flex-column gap-4'>
                        <div className="w-100 switch-buttons px-3">
                            <CustomSwitchBtn checked={permissionData.is_superuser} name='is_superuser' onClick={handelPermissionFormChange} title='مسؤل' />
                            <hr />
                            <CustomSwitchBtn checked={permissionData.is_staff} name='is_staff' onClick={handelPermissionFormChange} title='مساعد' />
                            <hr />
                            <CustomSwitchBtn checked={permissionData.is_vip} name='is_vip' onClick={handelPermissionFormChange} title='VIP' />
                        </div>
                        <div className="w-100 input-div px-3 mb-2" dir="rtl">
                            <DashboardMainBtn name='حفظ' bgColor='var(--fill-button-gradient)' hover='var(--tw-gradient-from)' />
                        </div>
                    </section>
                </form>
            )
        }
    }

    const givePermissions = () => {
        if (authUser.profile.profile.is_superuser) {
            return permissionForm();
        }
    }

    const dateFormatter = (value) => {
        let date = new Date(value);

        let newDate =
            new Intl.DateTimeFormat('ar-GB', {
                dateStyle: 'full',
                timeZone: 'Africa/Cairo',
            }).format(date)


        return newDate
    }

    if (loading === true) {
        return (
            <Container className='user-profile pb-5 d-flex justify-content-center align-items-center' style={{ 'minHeight': '70vh' }}>
                <LoadingGradient />
            </Container>
        )
    } else {
        return (
            <Container className='user-profile pb-5' style={{ 'minHeight': '70vh' }}>
                <div dir='rtl' className='profile-title w-100 d-flex justify-content-center align-items-center mt-5'>
                    <div className='d-flex p-0 d-flex justify-content-between align-items-center gap-2'>
                        <span><PersonIcon /></span>
                        <span>{filterUser('الملف الشخصي', 'ملف المستخدم')}</span>
                    </div>
                </div>
                <section className='profile-sec1 sec mt-5' dir='rtl'>
                    <div className='avatar-div d-flex justify-content-center align-items-center'>
                        <Avatar
                            sx={{ bgcolor: 'var(--color-dark-1)' }}
                            alt="Remy Sharp"
                            className="profile-avatar"
                        >
                            {
                                (userData.profile.is_superuser) ?
                                    <StarIcon style={{ 'width': '60px', 'height': '60px', 'color': 'goldenrod' }} />
                                    :
                                    (userData.profile.is_staff) ?
                                        <GiLayeredArmor style={{ 'width': '60px', 'height': '60px', 'color': 'goldenrod' }} />
                                        :
                                        (userData.profile.is_vip) ?
                                            <RiVipCrown2Fill style={{ 'width': '50px', 'height': '50px', 'color': 'goldenrod' }} />
                                            :
                                            ''
                            }
                            {/* {mainDataUser.first_name[0].toUpperCase()} */}
                        </Avatar>
                    </div>
                    <div className='head w-100 d-flex flex-column'>
                        <h4 className='d-flex gap-2 align-items-center'>
                            <span>{userData.first_name} {userData.last_name}</span>
                            {
                                (userData.profile.is_superuser) ? <VerifiedIcon />
                                    : (userData.profile.is_staff) ? <VerifiedUserIcon /> : ''
                            }
                        </h4>
                        <span style={{ 'color': 'var(--color-default-50)' }} className='p-0 w-100 ps-5 d-flex align-items-center flex-wrap gap-2 m-0 mb-1 email'><EmailIcon /> <span>{userData.email}</span> </span>
                        <span style={{ 'color': 'var(--color-default-50)' }} className='p-0 m-0 d-flex align-items-center flex-wrap gap-2'><PhoneEnabledIcon /> {userData.phone} </span>
                    </div>
                    <hr />
                    <div className='data'>
                        <div className="item d-flex gap-2">
                            <span style={{ 'color': 'var(--color-default-50)' }} className='p-0 m-0 d-flex align-items-center flex-wrap gap-2'><Grid3x3Icon /> {userData.id} </span>

                        </div>

                        <div className="item d-flex gap-2">
                            <span><ArrowLeftIcon /> تاريخ الإنضمام: </span>
                            <span>{dateFormatter(userData.start_date)}</span>
                        </div>
                        <div className="item d-flex gap-2">
                            <span><ArrowLeftIcon /> اخر تسجيل دخول: </span>
                            <span>{dateFormatter(userData.last_login)}</span>
                        </div>
                        {
                            (userData.profile.is_superuser !== true && userData.profile.is_staff !== true) ?
                                <>
                                    <div className="item d-flex gap-2">
                                        <span><ArrowLeftIcon />  هاتف ولي الأمر : </span>
                                        <span>{userData.profile.parent_phone}</span>
                                    </div>
                                    <div className="item d-flex gap-2">
                                        <span><ArrowLeftIcon /> الصف الدراسي : </span>
                                        <span>{userData.profile.grade}</span>
                                    </div>
                                    <div className="item d-flex gap-2">
                                        <span><ArrowLeftIcon /> المحافظة : </span>
                                        <span>{userData.profile.state}</span>
                                    </div>
                                    <div className="item d-flex gap-2">
                                        <span><ArrowLeftIcon /> النوع : </span>
                                        <span>{userData.profile.gender}</span>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="item d-flex gap-2">
                                        <span><ArrowLeftIcon />  الصلاحية : </span>
                                        <span>
                                            {
                                                (userData.profile.is_superuser) ? 'مسؤل' :
                                                    (userData.profile.is_staff) ? 'مساعد' : ''
                                            }
                                        </span>
                                    </div>
                                </>
                        }

                    </div>
                </section>
                {
                    givePermissions()
                }


                {
                    (userData.profile.is_superuser !== true && userData.profile.is_staff !== true) ?
                        <>
                            <div id='courses' className='title d-flex w-100 justify-content-between align-items-center'>
                                <span><ExpandMoreIcon /></span>
                                <span>{filterUser('كورساتي', 'الكورسات')}</span>
                            </div>
                            <section className='sec d-flex justify-content-center align-items-center'>
                                {
                                    (userData.courses.length <= 0) ?
                                        <div style={{ 'fontSize': '1.5em', 'color': 'var(--tw-gradient-from)' }} className='w-100 no-data d-flex justify-content-center align-items-center text-center gap-2 py-4'>  {filterUser('انت غير مشترك بأي كورس حتى الآن', 'غير مشترك بأي كورس')} <BsDatabaseFillX /></div>
                                        :
                                        <div className='row w-100 d-flex justify-content-start align-items-start' dir='rtl'>
                                            {
                                                userData.courses.map((course, i) => {
                                                    return (
                                                        <div key={i} className='col-lg-4 p-2'>
                                                            <Card className='course-card' sx={{ maxWidth: 345 }}>
                                                                <Link to={`/courses/${course.grade}/course/${course.id}/view`} style={{ 'color': 'var(--color-default2)' }}>
                                                                    <CardActionArea>
                                                                        <CardMedia
                                                                            component="img"
                                                                            image={CourseImage}
                                                                            alt="green iguana"
                                                                        />
                                                                        <CardContent>
                                                                            <Typography gutterBottom variant="h5" component="div">
                                                                                {course.title}
                                                                            </Typography>
                                                                            <Typography variant="body2" sx={{ color: 'var(--color-default-50)', whiteSpace: "pre-line" }}>
                                                                                {course.description}
                                                                            </Typography>
                                                                        </CardContent>
                                                                    </CardActionArea>
                                                                </Link>
                                                                <CardActions dir='ltr' className='w-100 d-flex course-progress'>
                                                                    <LinearProgressWithLabel className='w-100' value={course.progress} />
                                                                </CardActions>
                                                            </Card>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                }

                            </section>
                            <div className='title d-flex w-100 justify-content-between align-items-center'>
                                <span><ExpandMoreIcon /></span>
                                <span>{filterUser('إحصائياتي', 'الإحصائيات')}</span>
                            </div>
                            <section id='statistics' dir='rtl' className='sec d-flex justify-content-center align-items-center py-5'>
                                <div className='row w-100 d-flex justify-content-center align-items-center'>

                                    {
                                        userData.statistics.map((statistic, i) => {
                                            return (
                                                <div key={i} className='col-lg-4 statistics p-2 d-flex flex-column justify-content-center align-items-center'>
                                                    <Progress
                                                        type="dashboard"
                                                        steps={8}
                                                        percent={parseInt(statistic.value)}
                                                        trailColor="var(--tw-gradient-from-light)"
                                                        strokeColor="var(--tw-gradient-from)"
                                                        strokeWidth={20}
                                                        width={160}
                                                    />
                                                    <p style={{ 'color': 'var(--color-default2)', 'fontSize': '1.1em' }} className='text-center w-75'>{statistic.title}</p>
                                                    {
                                                        (statistic.count != null) ?
                                                            <p style={{ 'color': 'var(--color-default2)', 'fontSize': '1.2em' }} className='text-center d-flex justify-content-center align-items-center w-75 gap-3 fw-bold'><span className='text-danger'>{statistic.count.end}</span>من<span className='text-danger'>{statistic.count.from}</span></p>
                                                            :
                                                            <></>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </section>
                            <div className='title d-flex w-100 justify-content-between align-items-center'>
                                <span><ExpandMoreIcon /></span>
                                <span>الفواتير</span>
                            </div>
                            <section id='invoice' dir='rtl' className='sec py-4'>
                                {
                                    (userData.invoices.length <= 0) ?
                                        <div dir='ltr' style={{ 'fontSize': '1.5em', 'color': 'var(--tw-gradient-from)' }} className='w-100 no-data d-flex justify-content-center align-items-center text-center gap-2 py-4'>  لايوجد فواتير <BsDatabaseFillX /></div>
                                        :
                                        <div className='area-table w-100'>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th className='td-id'>#</th>
                                                        <th className='head'><span>رقم العملية</span></th>
                                                        <th className='head'><span>إجمالي سعر الفاتورة</span></th>
                                                        <th className='head'><span> التخفيض</span></th>
                                                        <th className='head'><span>الكوبون</span></th>
                                                        <th className='head'><span> المشتريات</span></th>
                                                        <th className='head'><span>حالة الدفع</span></th>
                                                        <th className='head'><span>وقت إنشاء الفاتورة</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        userData.invoices.map((invoice, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td className='td-id'>{invoice.id}</td>
                                                                    <td><span style={{ 'color': 'var(--red-light)', 'fontWeight': 'bold' }}>{invoice.transaction}</span></td>
                                                                    <td>{parseFloat(invoice.price).toFixed(2)} ج</td>
                                                                    <td>0.00 ج</td>
                                                                    <td>لا يوجد</td>
                                                                    <td>{invoice.course__title}</td>
                                                                    <td>{(invoice.is_active === true) ? <span className='active'>تم الدفع</span> : <span className='not-paid'>في انتظار الدفع ...</span>}</td>
                                                                    <td>{dateFormatter(invoice.request_dt)}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                }
                            </section>
                        </>
                        :
                        <></>
                }

            </Container>
        )
    }
}