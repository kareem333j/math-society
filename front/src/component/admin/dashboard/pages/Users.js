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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Users() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [userSearched, setUserSearched] = useState(false);
    const [notHavePermission, setNotHavePermission] = useState({ catch: false, msg: '' });
    const [openGrades, setOpenGrades] = useState({});

    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal } = state;

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

        if (value === null || value.length === 0) {
            setUserSearched(false);
            getUsers();
        }
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

    const groupUsersByGrade = () => {
        const grouped = {};
        users.forEach(user => {
            const grade = user.grade || 'غير محدد';
            if (!grouped[grade]) {
                grouped[grade] = [];
            }
            grouped[grade].push(user);
        });
        return grouped;
    }

    const toggleGradeTable = (grade) => {
        setOpenGrades(prev => ({
            ...prev,
            [grade]: !prev[grade]
        }));
    }

    const renderTable = (usersList) => (
        <div className='users-div area-table'>
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
                    {usersList.map(user => (
                        <tr key={user.id}>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }} className='td-id'>{user.id}</td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>
                                <div className='user-main-info d-flex flex-row'>
                                    <div>
                                        <Avatar className='avatar' sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }} data-content={user.userInfo.first_name[0]} alt="User" />
                                    </div>
                                    <div className='content d-flex flex-column'>
                                        <h3>{(user.userInfo.first_name + ' ' + user.userInfo.last_name).slice(0, 26)}{(user.userInfo.first_name + ' ' + user.userInfo.last_name).length > 26 ? '...' : ''}</h3>
                                        <span>
                                            {user.userInfo.is_superuser ? <span className='admin-user'>ادمن</span> : user.userInfo.is_staff ? <span className='staff-user'>مساعد</span> : <span className='student-user'>طالب</span>}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>{user.userInfo.phone || 'لايوجد'}</td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>{user.parent_phone || 'لايوجد'}</td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>{user.userInfo.data_join}</td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>{user.userInfo.is_active ? <span className='active'>مفعل</span> : <span className='not-active'>غير مفعل</span>}</td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>{(user.userInfo.email.length > 26) ? `...${user.userInfo.email.slice(0, 26)}` : user.userInfo.email}</td>
                            <td style={{ background: user.is_vip ? 'goldenrod' : '' }}>
                                <div className='d-flex gap-4 px-3'>
                                    <Tooltip title="تعديل">
                                        <IconButton size="large" edge="start" color="inherit" aria-label="edit" className='custom-edit-button options-btn' component={Link} to={`/user/${user.user}/profile`}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="حذف">
                                        <IconButton size="large" edge="start" color="inherit" aria-label="delete" className='custom-delete-button options-btn' onClick={() => handleDeleteBtn(user.user)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="users">
            <div className='options w-100 admin-search pt-2 px-1 d-flex justify-content-center align-items-center'>
                <SearchBar
                    placeholder="ابحث عن مستخدم..."
                    onChange={handleSearchChange}
                />
            </div>

            {loading ? (
                <LoadingGradient />
            ) : userSearched ? (
                renderTable(users)
            ) : (
                Object.entries(groupUsersByGrade()).map(([grade, usersInGrade], idx) => (
                    <div key={idx} className='w-100 d-flex flex-column mt-2'>
                        <div
                            onClick={() => toggleGradeTable(grade)}
                            className='title d-flex justify-content-start align-items-center gap-2 p-2 mt-3'
                            style={{
                                backgroundColor: 'var(--color-dark-1)',
                                color: 'var(--color-default2)',
                                borderRadius: '5px',
                                fontWeight: 'bold',
                                fontSize: '1.1em',
                                cursor: 'pointer',
                                boxShadow: 'var(--default-shadow2)',
                            }}
                        >
                            <ArrowDropDownIcon />
                            {grade}
                            <span style={{ backgroundColor: 'red', padding: '2px 9px', borderRadius: '100%' }}>{usersInGrade.length}</span>
                        </div>
                        <div className={`users-div area-table ${!openGrades[grade] ? 'd-none' : ''}`}>
                            {renderTable(usersInGrade)}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
