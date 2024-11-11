import "./auth.css";
import mathLogin from "../../assets/images/math-login.jpg";
import { PiMathOperationsFill } from "react-icons/pi";
import { FaPhone } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../Axios";
import LinearIndeterminate from "../loading/loading1";
import { AlertSuccess } from "../errors/AlertSuccess";
import FieldError from "../errors/Field_error";
import { ExistBefore } from "../errors/auth/ExistBefore";
import { useLocation } from 'react-router-dom';

function Login(props) {
  const dataAuth = props.dataAuth;
  const navigate = useNavigate();
  let location = useLocation();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [badReq, setBadReq] = useState(false);

  const handelChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    })
  }

  const alert = (dataAlert) => {
    AlertSuccess(dataAlert);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post(`token/`, {
        phone: formData.phone,
        password: formData.password,
      })
      .then((res) => {
        setLoading(false);
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        axiosInstance.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
        if(location.state != null){
          window.location.href = `${window.location.origin}${location.state.next}`;
        }else{
          window.location.href = '/';
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          if (err.response.status === 400 || err.response.status === 401) {
            setBadReq(true);
          }
        } else {
          alert({
            action: () => {
              console.log('error login');
            },
            btn: 'ok',
            icon: 'error',
            title: 'خطأ',
            text: 'لقد حدث خطأ حاول في وقت لاحق واذا لم تحل المشكلة قم بالتواصل مع الدعم'
          });
        }
        navigate("/login");

      });
  }

  const badRequest = () => {
    var err = (badReq === true) ? <FieldError msg='رقم الهاتف او كلمة السر غير صحيح' /> : <></>;
    const errTimer = setTimeout(() => {
      setBadReq(false);
      clearTimeout(errTimer);
    }, 10000);
    return err
  };
  if (dataAuth.isAuthenticated === true) {
    return (
      <ExistBefore
        title='تحذير'
        message='
        انت قيد تسجيل الدخول بالفعل اذا كنت تريد تسجيل الدخول بحساب آخر عليك بتسجيل الخروج اولا 
        '
        actions={
          {
            'btn1': { 'name': 'الرئيسية', 'to': '/', 'bgColor': 'var(--title-background)', 'color': '#fff' },
            'btn2': { 'name': 'تسجيل الخروج', 'to': '/logout', 'bgColor': 'var(--red1)', 'color': '#fff' },
          }
        } />
    )
  } else {
    return (
      <>
        <LinearIndeterminate load={loading} />

        <div className="auth">
          <div className="image-container">
            <img src={mathLogin} alt="auth login" className="auth-img" />
          </div>
          <div className="auth-container">
            <div className="auth-content">
              <h3 className="auth-title">
                تسجيل <span>الدخول:</span>
                <PiMathOperationsFill className="auth-icon" />
              </h3>
              <p className="auth-description">
                ادخل علي حسابك بإدخال رقم الهاتف و كلمة المرور المسجل بهم من قبل
              </p>
              {badRequest()}
              <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                <div className="input">
                  <input
                    type="text"
                    name="phone"
                    placeholder="رقم الهاتف"
                    required
                    value={formData.phone}
                    pattern="^01([0-2]|5)\d{8}$"
                    onChange={handelChange}
                  />
                  <div className="input-bg"></div>
                  <FaPhone className="input-icon" />
                </div>
                <div className="input">
                  <input
                    type="password"
                    name="password"
                    placeholder="كلمة السر"
                    required
                    value={formData.password}
                    onChange={handelChange}
                  />
                  <div className="input-bg"></div>
                  <RiLockPasswordFill className="input-icon" />
                </div>
                <button className="auth-btn" onClick={handleSubmit}>تسجيل الدخول</button>
              </form>
              <p className="go-register">
                لا يوجد لديك حساب؟{" "}
                <Link to="/register">
                  <span>انشئ حسابك الآن!</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
