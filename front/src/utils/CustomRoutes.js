import { useContext } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoutes = (props) => {
    const AuthDataContext = useContext(AuthContext);
    const dataProfile = AuthDataContext.dataProfile;
    if (dataProfile.isAuthenticated != null) {
        return dataProfile.isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
    }
}

export const AdminRoutes = (props) => {
    const AuthDataContext = useContext(AuthContext);
    const dataProfile = AuthDataContext.dataProfile;

    if (dataProfile.isAuthenticated != null) {
        return (dataProfile.isAuthenticated) ?
            (dataProfile.profile.profile.is_superuser || dataProfile.profile.profile.is_staff) ?
                <Outlet />
                :
                <Navigate to='/' />
            :
            <Navigate to='/login' />;
    }
}

export const ProfileRoutes = (props) => {
    const AuthDataContext = useContext(AuthContext);
    const dataProfile = AuthDataContext.dataProfile;
    const params = useParams();
    const profileId = params.user_id;

    if (dataProfile.isAuthenticated != null) {
        return (dataProfile.isAuthenticated === true) ?
            (parseInt(dataProfile.profile.id) === parseInt(profileId) || dataProfile.profile.profile.is_superuser || dataProfile.profile.profile.is_staff) ?
                <Outlet />
                :
                <Navigate to='/' />
            :
            <Navigate to='/login' />;
    }
}