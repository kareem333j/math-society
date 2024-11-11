import React,{ useEffect } from "react";
import axiosInstance from "../../Axios";
import { useNavigate } from "react-router-dom"; // to redirect


function Logout(){
    const history = useNavigate()
    
    useEffect(()=>{
        const logout = ()=>{
            const response = axiosInstance.post('user/logout/blacklist/', {
                refresh_token: localStorage.getItem('refresh_token'),
            });
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            window.location.href = '/';
        }
        if(localStorage.getItem('refresh_token')){
            logout();
        }else{
            history('/login');
        }
    }, []);
    return(
        <div className="alert alert-success">Logout success..</div>
    )
}

export default Logout;