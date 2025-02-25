import { InputAdornment } from "@mui/material";
import { CustomNumberField } from "../admin/dashboard/inherit/fields/NumberField";
import { CustomTextField } from "../admin/dashboard/inherit/fields/TextField";
import './subscribe.css'
import { DashboardMainBtn } from "../inherit/DashboardMainBtn";
import { useState } from "react";
import { useSnackbar } from "notistack";
import LinearIndeterminate from "../loading/loading1";
import axiosInstance from "../../Axios";


export default function PaymentForm(props) {
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal, open } = state;
    const handleClickVariant = (variant, msg) => {
        enqueueSnackbar(msg, { variant: variant, anchorOrigin: { vertical, horizontal } });
    }
    const [loading, setLoading] = useState(false);
    // const [formHasError, setFormHasError] = useState({
    //     phone: true,
    //     price: true,
    // });
    const [dataPayment, setDataPayment] = useState({
        phone: '',
        transaction_number: '',
        price: 0
    });

    const setPaymentForm = (e) => {
        let { name, value } = e.target;
    
        setDataPayment(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    
    const submitPayment = (e) => {
        e.preventDefault();

        const phoneRE = /^01[0-2,5]\d{8}$/;
        const priceRE = /^\d+(\.\d{1,5})?$/;

        const phoneValid = phoneRE.test(dataPayment.phone);
        const priceValid = priceRE.test(dataPayment.price) && Number(dataPayment.price) >= 5;

        // setFormHasError({ phone: !phoneValid, price: !priceValid });

        if (phoneValid && priceValid) {
            sendPayment();
            
        } else {
            if(phoneValid === false) {
                handleClickVariant('error', "يرجي إدخال رقم الهاتف بشكل صحيح");
            }
            if(priceValid === false) {
                handleClickVariant('error', "يرجي إدخال المبلغ المدفوع بشكل صحيح");
            }
        }
    }

    const sendPayment = () => {
        setLoading(true);
        axiosInstance
            .post(`courses/payment/process`, {
                course: props.course_id,
                ...dataPayment,
            })
            .then((response) => {
                setLoading(false);
                handleClickVariant('success', "تم الإرسال بنجاح");
                props.reGetCourse();
                props.reGetTransaction();
                props.close();
            })
            .catch((err) => {
                setLoading(false);
            })
    }

    return (
        <div className='w-100 dialog-content overflow-hidden'>
            <LinearIndeterminate load={loading} />
            <div className="container">
                <form onSubmit={submitPayment} className="payment-form mt-5" method="post">
                    <div className="w-100 m-0 mb-2 ms-2 p-0 d-flex flex-column">
                        <label className="input-label">رقم الهاتف *</label>
                        <CustomTextField
                            label="رقم الهاتف المحول منه"
                            name="phone"
                            onChange={setPaymentForm}
                        />
                    </div>
                    <div className="w-100 m-0 mb-2 ms-2 p-0 d-flex flex-column">
                        <label className="input-label">  رقم التحويل (رقم العملية) *</label>
                        <CustomTextField
                            label="ادخل رقم عملية التحويل"
                            name="transaction_number"
                            onChange={setPaymentForm}
                        />
                    </div>
                    <div className="w-100 m-0 mb-2 ms-2 p-0 d-flex flex-column">
                        <label className="input-label">المبلغ المدفوع *</label>
                        <CustomNumberField
                            inputProps={{ min: 5, max: 999 }}
                            defaultValue={0}
                            label="المبلغ المدفوع"
                            name='price'
                            icon={<InputAdornment position="start">ج</InputAdornment>}
                            type='text'
                            onChange={setPaymentForm}
                        />
                    </div>
                    <div className="w-100">
                        <h6 className="text-danger">تنبيه المبلغ المطلوب دفعه هو : <strong>{props.required_price}ج</strong></h6>
                    </div>
                    <div className="mt-4 submit" dir="rtl">
                        <DashboardMainBtn name='تم' bgColor='var(--fill-button-gradient)' hover='var(--tw-gradient-from)' />
                    </div>
                </form>
            </div>
        </div>
    )
}