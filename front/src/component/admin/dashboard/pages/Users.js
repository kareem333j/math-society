import { Avatar, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './shared.css';
import { SearchBar } from '../inherit/SearchBar';
import axiosInstance from '../../../../Axios';
import { useEffect, useState } from 'react';
import LoadingGradient from '../../../loading/Loading2';
import { Link } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { enqueueSnackbar } from 'notistack';


export default function Users() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [userSearched, setUserSearched] = useState(false);
    const [notHavePermission, setNotHavePermission] = useState({ catch: false, msg: '' });

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
        getUsers();
    }, [])

    const getUsers = () => {
        setLoading(true);
        axiosInstance
            .get('admin/users')
            .then((response) => {
                setLoading(false);
                setUsers(response.data);
                setUserSearched(false);
            })
            .catch((err) => {
                setUserSearched(false);
                setLoading(false);
                if (err.response.status === 403) {
                    setNotHavePermission({ catch: true, msg: err.response.data.detail });
                } else {
                    setNotHavePermission({ catch: false, msg: 'have access' });
                }
            })
    }


    const handleSearchChange = (e) => {
        var text = e.target.value;
        let text_without_spacing = text.replace(/\s+/g, '');
        var value = text;

        if (text_without_spacing === '') {
            value = null;
        }
        setLoading(true);
        axiosInstance
            .get(`admin/users/search/${value}`)
            .then((response) => {
                setLoading(false);
                setUsers(response.data);
                setUserSearched(true);
            })
            .catch((err) => {
                setUserSearched(true);
                setLoading(false);
                if (err.response.status === 403) {
                    setNotHavePermission({ catch: true, msg: err.response.data.detail });
                } else {
                    setNotHavePermission({ catch: false, msg: 'have access' });
                }
            });
    }

    const deleteUser = (user_id) => {
        setLoading(true);
        axiosInstance
            .delete(`admin/users/${user_id}/delete`)
            .then(() => {
                setLoading(false);
                getUsers();
                handleClickVariant('success', 'تم حذف المستخدم بنجاح');
            }).catch((err) => {
                setLoading(false);
                handleClickVariant('error', 'لقد حدث خطأ ');
            })
    }

    const handleDeleteBtn = (user_id) => {
        withReactContent(Swal).fire({
            title: "! حذف ",
            text: "هل انت متأكد من حذف هذا المستخدم",
            icon: "question",
            cancelButtonText: "إلغاء",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "نعم, حذف",
        }).then((response) => {
            if (response.isConfirmed) {
                deleteUser(user_id);
            }
        });
    }

    return (
        <div className="users">
            <div className='options w-100 admin-search pt-2 px-1 d-flex justify-content-center align-items-center'>
                <SearchBar
                    placeholder="ابحث عن مستخدم..."
                    onChange={handleSearchChange}
                />
            </div>
            <div className='users-div area-table'>
                {
                    (users.length <= 0) ?
                        <div style={{ 'minHeight': '50vh' }} className='d-flex justify-content-center align-items-center'>
                            <span style={{ 'fontSize': '1.7em', 'color': 'var(--text-cyan-700)' }}>
                                {
                                    (notHavePermission.catch) ?
                                        notHavePermission.msg
                                        :
                                        (userSearched) ?
                                            'لا يوجد اي مستخدم بهذه البيانات'
                                            :
                                            (loading === true) ? <LoadingGradient />
                                                :
                                                'لا يوجد اي مستخدم حتي الأن'
                                }
                            </span>
                        </div>
                        :
                        (loading === true) ? <LoadingGradient />
                            :
                            <table>
                                <thead>
                                    <tr>
                                        <th className='td-id'>#</th>
                                        <th className='head'><span>المستخدم</span></th>
                                        <th className='head'><span>رقم الهاتف</span></th>
                                        <th className='head'><span>رقم هاتف ولي الأمر</span></th>
                                        <th className='head'><span>تاريخ الإنضمام</span></th>
                                        <th className='head'><span>الحالة</span></th>
                                        <th className='head'><span>البريد الإلكتروني</span></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map((user) => {
                                            return (
                                                <tr key={user.id}>
                                                    <td style={{ 'background': (user.is_vip) ? 'goldenrod' : '' }} className='td-id'>{user.id}</td>
                                                    <td style={{ 'background': (user.is_vip) ? 'goldenrod' : '' }}>
                                                        <div className='user-main-info d-flex flex-row'>
                                                            <div>
                                                                <Avatar className='avatar' sx={{ p: 0, 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }} data-content={user.userInfo.first_name[0]} alt="Remy Sharp" />
                                                            </div>
                                                            <div className='content d-flex flex-column'>
                                                                <h3>{((user.userInfo.first_name + ' ' + user.userInfo.last_name).length > 26) ? `${(user.userInfo.first_name + ' ' + user.userInfo.last_name).substring(0, 26)}...` : (user.userInfo.first_name + ' ' + user.userInfo.last_name)}</h3>
                                                                <span>
                                                                    {
                                                                        (user.userInfo.is_superuser) ? <span className='admin-user'>ادمن</span>
                                                                            :
                                                                            (user.userInfo.is_staff) ? <span className='staff-user'>مساعد</span>
                                                                                :
                                                                                <span className='student-user'>طالب</span>
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ 'background': (user.is_vip) ? 'goldenrod' : '' }}>
                                                        {
                                                            (user.userInfo.phone.length <= 0) ? 'لايوجد'
                                                                :
                                                                user.userInfo.phone
                                                        }
                                                    </td>
                                                    <td style={{ 'background': (user.is_vip) ? 'goldenrod' : '' }}>
                                                        {
                                                            (user.parent_phone.length <= 0) ? 'لايوجد'
                                                                :
                                                                user.parent_phone
                                                        }
                                                    </td>
                                                    <td style={{ 'background': (user.is_vip) ? 'goldenrod' : '' }}>{user.userInfo.data_join}</td>
                                                    <td style={{ 'background': (user.is_vip) ? 'goldenrod' : '' }}>
                                                        {
                                                            (user.userInfo.is_active) ? <span className='active'>مفعل</span>
                                                                :
                                                                <span className='not-active'>غير مفعل</span>
                                                        }
                                                    </td>
                                                    <td style={{ 'background': (user.is_vip) ? 'goldenrod' : '' }}>{(user.userInfo.email.length > 26) ? `...${(user.userInfo.email).substring(0, 26)}` : user.userInfo.email}</td>
                                                    <td style={{ 'background': (user.is_vip) ? 'goldenrod' : '' }}>
                                                        <div className='d-flex gap-4 px-3'>
                                                            <Tooltip title="تعديل">
                                                                <IconButton
                                                                    size="large"
                                                                    edge="start"
                                                                    color="inherit"
                                                                    aria-label="edit"
                                                                    className='custom-edit-button options-btn'
                                                                    component={Link}
                                                                    to={`/user/${user.user}/profile`}
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
                                                                    onClick={() => { handleDeleteBtn(user.user) }}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                }
            </div>
        </div>
    )
}