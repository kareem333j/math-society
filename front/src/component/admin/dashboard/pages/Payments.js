import { useEffect, useState } from "react";
import axiosInstance from "../../../../Axios";
import LoadingGradient from "../../../loading/Loading2";
import LinearIndeterminate from "../../../loading/loading1";
import { SearchBar } from "../inherit/SearchBar";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import './shared.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';
import { enqueueSnackbar } from "notistack";



export default function Payments(props) {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [userSearched, setUserSearched] = useState(false);
    const [loadPayment, setLoadPayment] = useState(false);

    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal, open } = state;

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = () => {
        setLoading(true);
        axiosInstance
            .get('admin/courses/payments/requests')
            .then((response) => {
                setLoading(false);
                setRequests(response.data);
                setUserSearched(false);
            })
            .catch((err) => {
                setUserSearched(false);
                setLoading(false);
                console.log(err);
            })
    }

    const handleClickVariant = (variant, msg) => {
        enqueueSnackbar(msg, { variant: variant, anchorOrigin: { vertical, horizontal } });
    }

    const print_payment = (paymentDetailsTemplate) => {
        let mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
        mywindow.document.write(paymentDetailsTemplate);
        mywindow.document.close();
        mywindow.focus()
        mywindow.print();
        mywindow.close();
    }

    const active_payment = (transaction, paymentDetailsTemplate, type) => {
        setLoadPayment(true);
        axiosInstance
            .put(`admin/courses/payments/${transaction}/activate`)
            .then(() => {
                setLoadPayment(false);

                getUsers();
                if (type === 'active') {
                    handleClickVariant('success', 'تم التفعيل بنجاح');
                    withReactContent(Swal).fire({
                        title: "عملية ناجحة",
                        text: "هل تريد طباعة فاتورة ؟",
                        icon: 'success',
                        cancelButtonText: "إلغاء",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "طباعة",
                    }).then((response) => {
                        if (response.isConfirmed) {
                            print_payment(paymentDetailsTemplate);
                        }
                    });
                }
                else {
                    handleClickVariant('success', 'تم إلغاء التفعيل بنجاح');
                }

            })
            .catch(() => {
                setLoadPayment(false);
                handleClickVariant('error', 'لقد حدث خطأ ');
            });
    }

    const handleDetailsBtn = (id, is_active, type) => {
        let paymentDetailsTemplate = ``;
        var course_transaction_number = 0;
        requests.map((request) => {
            if (request.id === id) {
                course_transaction_number = request.transaction;
                paymentDetailsTemplate = `
                    <table dir='rtl' border='1' align='center' width='600' id="payment-table">
                        <tr>
                            <th>اسم الطالب</th>
                            <td>${request.user_info.first_name + ' ' + request.user_info.last_name}</td>
                        </tr>
                        <tr>
                            <th>اسم الكورس</th>
                            <td>${request.course_info.title}</td>
                        </tr>
                        <tr>
                            <th>المبلغ المطلوب</th>
                            <td>${request.price} ج</td>
                        </tr>
                        <tr>
                            <th>رقم العملية</th>
                            <td>${request.transaction}</td>
                        </tr>
                    <table>
                `
            }
        })

        if (is_active) {
            if (type === 'deActive') {
                withReactContent(Swal).fire({
                    title: "هل متأكد من إالغاء تفعيل عملية الدفع هذه ؟",
                    icon: 'question',
                    cancelButtonText: "إلغاء",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "إلغاء التفعيل",
                }).then((response) => {
                    if (response.isConfirmed) {
                        active_payment(course_transaction_number, paymentDetailsTemplate, 'deActive');
                    }
                });
            } else {
                withReactContent(Swal).fire({
                    html: paymentDetailsTemplate,
                    cancelButtonText: "إلغاء",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "طباعة",
                }).then((response) => {
                    if (response.isConfirmed) {
                        print_payment(paymentDetailsTemplate);
                    }
                });
            }

        } else {
            withReactContent(Swal).fire({
                html: paymentDetailsTemplate,
                cancelButtonText: "إلغاء",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "تفعيل",
            }).then((response) => {
                if (response.isConfirmed) {
                    active_payment(course_transaction_number, paymentDetailsTemplate, 'active');
                }
            });
        }
    }

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

    const handleSearchChange = (e) => {
        var text = e.target.value;
        let text_without_spacing = text.replace(/\s+/g, '');
        var value = text;

        if (text_without_spacing === '') {
            value = null;
        }
        setLoading(true);
        axiosInstance
            .get(`admin/courses/payments/search/${value}`)
            .then((response) => {
                setLoading(false);
                setRequests(response.data);
                setUserSearched(true);
            })
            .catch((error) => {
                setUserSearched(true);
                setLoading(false);
                console.log(error);
            });
    }

    return (
        <div className="payments w-100">
            <LinearIndeterminate load={loadPayment} />
            <div className='options w-100 admin-search pt-2 px-1 d-flex justify-content-center align-items-center'>
                <SearchBar
                    placeholder="ابحث برقم العملية..."
                    onChange={handleSearchChange}
                />
            </div>
            <div className='area-table w-100'>
                {
                    (requests.length <= 0) ?
                        <div style={{ 'minHeight': '50vh' }} className='d-flex justify-content-center align-items-center'>
                            <span style={{ 'fontSize': '1.7em', 'color': 'var(--text-cyan-700)' }}>
                                {
                                    (userSearched) ?
                                        'لا يوجد اي عملية دفع بهذه البيانات'
                                        :
                                        (loading === true) ? <LoadingGradient />
                                            :
                                            'لا يوجد اي عملية دفع حتي الأن'
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
                                        <th className='head'><span>رقم العملية</span></th>
                                        <th className='head'><span>تاريخ العملية</span></th>
                                        <th className='head'><span>حالة الدفع</span></th>
                                        <th className='head'><span>الكورس</span></th>
                                        <th className='head'><span>السعر</span></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        requests.map((request) => {
                                            return (
                                                <tr key={request.id}>
                                                    <td className='td-id'>{request.id}</td>
                                                    <td>
                                                        <div className='user-main-info d-flex flex-row align-items-center'>
                                                            <div>
                                                                <Avatar className='avatar' sx={{ p: 0, 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }} data-content={request.user_info.first_name[0]} alt="Remy Sharp" />
                                                            </div>
                                                            <div className='content d-flex'>
                                                                <h3>{((request.user_info.first_name + ' ' + request.user_info.last_name).length > 26) ? `${(request.user_info.first_name + ' ' + request.user_info.last_name).substring(0, 26)}...` : (request.user_info.first_name + ' ' + request.user_info.last_name)}</h3>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {
                                                            (request.user_info.phone.length <= 0) ? 'لايوجد'
                                                                :
                                                                request.user_info.phone
                                                        }
                                                    </td>
                                                    <td>
                                                        <span style={{ 'color': 'var(--red-light)', 'fontWeight': 'bold' }}>{request.transaction}</span>
                                                    </td>
                                                    <td>{dateFormatter(request.request_dt)}</td>
                                                    <td>
                                                        {
                                                            (request.is_active) ? <span className='active'>تم الدفع</span>
                                                                :
                                                                <span className='not-active'>غير مدفوع</span>
                                                        }
                                                    </td>
                                                    <td>{(request.course_info.title.length > 26) ? `...${(request.course_info.title).substring(0, 26)}` : request.course_info.title}</td>
                                                    <td>{request.price} ج</td>
                                                    <td>
                                                        <div className='d-flex gap-4 px-3'>
                                                            <Tooltip title="تفاصيل">
                                                                <IconButton
                                                                    size="large"
                                                                    edge="start"
                                                                    color="inherit"
                                                                    aria-label="details"
                                                                    className='custom-edit-button options-btn'
                                                                    // onClick={() => handleDetailsBtn(request.id, request.is_active)}
                                                                    data-bs-toggle="dropdown"
                                                                    aria-expanded="false"
                                                                >
                                                                    <MoreHorizIcon />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <ul className={`dropdown-menu dropdown-menu${(props.data_theme) ? '-dark' : ''}`}>
                                                                {
                                                                    (request.is_active) ?
                                                                        <>
                                                                            <li onClick={() => handleDetailsBtn(request.id, request.is_active, 'normal')}><span className="dropdown-item" style={{ "cursor": "pointer" }}>تفاصيل</span></li>
                                                                            <li onClick={() => handleDetailsBtn(request.id, request.is_active, 'deActive')}><span className="dropdown-item" style={{ "cursor": "pointer" }}>الغاء التفعيل</span></li>
                                                                        </>
                                                                        :
                                                                        <li onClick={() => handleDetailsBtn(request.id, request.is_active, 'normal')}><span className="dropdown-item" style={{ "cursor": "pointer" }}>تفعيل</span></li>
                                                                }
                                                            </ul>
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