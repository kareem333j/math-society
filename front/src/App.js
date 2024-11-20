import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Header from "./component/header/header";
import Home from "./Home";
import Footer from "./component/footer/Footer";
import useLocalStorage from "use-local-storage";
import Courses from "./component/courses/Courses";
import CoursesAdmin from "./component/admin/dashboard/pages/Courses";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import { useContext, useEffect, useState } from "react";
import axiosInstance from "./Axios";
import { jwtDecode } from "jwt-decode";
import Logout from "./component/auth/Logout";
import { AlertSuccess } from "./component/errors/AlertSuccess";
import { Warning } from "./component/errors/Warning";
import CourseContent from "./component/courses/course-content/CourseContent";
import ViewCourse from "./component/courses/course-content/ViewCourse";
import { SubscribePage } from "./component/subscribe/SubscribePage";
import { SnackbarProvider } from "notistack";
import { Main } from "./component/admin/dashboard/Main";
import Payments from "./component/admin/dashboard/pages/Payments";
import Users from "./component/admin/dashboard/pages/Users";
import Add from "./component/admin/dashboard/pages/courses-pages/Add";
import Edit from "./component/admin/dashboard/pages/courses-pages/Edit";
import AddCourseProvider from "./context/AddCourseContext";
import EditCourseProvider from "./context/EditCourseContext";
import CourseMainPageForAdmin from "./component/admin/dashboard/pages/courses-pages/Main";
import CourseDataProvider from "./context/AdminCourseDataContext";
import UserProfile from './component/user/profile/Profile';
import { AdminRoutes, ProfileRoutes, ProtectedRoutes } from "./utils/CustomRoutes";
import { AuthContext } from "./context/AuthContext";
import { NotificationPage } from "./notifications/Notification";
import NotificationsAdmin from "./component/admin/dashboard/pages/Notifications";
import NotificationProvider from "./context/NotificationsContext";

function App() {
  const [isDark, setIsDark] = useLocalStorage("isDark", true);
  const [dataProfile, setDataProfile] = useState({
    isAuthenticated: false,
    profile: null,
  });

  let [user, setUser] = useState(() => localStorage.getItem('access_token') ? jwtDecode(localStorage.getItem('access_token')) : null)
  const [networkError, setNetworkError] = useState(false);
  const location = useLocation();
  const [loadDataUser, setLoadDataUser] = useState(false);
  const AuthDataContext = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      setUser(jwtDecode(localStorage.getItem('access_token')))
    } else {
      setUser(null);
    }
    setLoadDataUser(true);
    if (user != null) {
      axiosInstance
        .get(`profile/${user.user_id}`)
        .then((response) => {
          setLoadDataUser(false);
          setDataProfile({ isAuthenticated: true, profile: response.data });
          AuthDataContext.setDataProfile({ isAuthenticated: true, profile: response.data });
        })
        .catch((error) => {
          setLoadDataUser(false);
          alert({
            action: () => {
            },
            btn: 'ok',
            icon: 'error',
            position: 'center-center',
            reload:true,
            title: 'خطأ',
            text: 'لقد حدث خطأ ما تأكد من اتصالك بالإنترنت ثم قم بإعادة تحميل الصفحة مرة اخري'
          });
          setNetworkError(true);
        })
    } else {
      AuthDataContext.setDataProfile(dataProfile);
    }
  }, []);

  useEffect(() => {
    const my_app = document.getElementById('app');
    if (location.pathname === '/') {
      my_app.classList.add('home');
    } else {
      my_app.classList.remove('home');
    }
  }, [location])

  const alert = (dataAlert) => {
    AlertSuccess(dataAlert);
  }

  return (
    <SnackbarProvider maxSnack={3}>
      <div className="app" id='app' data-theme={isDark ? "dark" : "light"}>
        <Header isChecked={isDark} handelMode={() => setIsDark(!isDark)} dataAuth={dataProfile} data_theme={isDark} />
        {(networkError === true) ? <Warning title='تحذير هام' message="هناك خطأ ما قد حدث قد لا يعمل الموقع بشكل سليم تأكد من اتصالك بالإنترنت ثم قم بإعادة تحميل الموقع واذا لم تحل المشكلة تواصل مع الدعم" /> : <></>}

        <Routes>
          {/* Home route */}
          <Route exact path="/" element={<Home dataAuth={dataProfile} />} />

          {/* course routes */}
          <Route path="/courses/:grade" element={<><Outlet /></>} >
            <Route path="" element={<Courses dataAuth={dataProfile} />} />
            <Route path="/courses/:grade" element={<><Outlet /></>} />
            <Route path="course/:course_id" element={<CourseContent dataAuth={dataProfile} data_theme={isDark ? "dark" : "light"} />} />
            <Route path="course/:course_id/view" element={<ViewCourse dataAuth={dataProfile} />} />
            <Route path="course/:course_id/subscribe" element={<SubscribePage dataAuth={dataProfile} userLoaded={loadDataUser} />} />
          </Route>

          {/* auth routes */}
          <Route path="/login" element={<Login dataAuth={dataProfile} />} />
          <Route path="/register" element={<Register dataAuth={dataProfile} />} />
          <Route path="/logout" element={<Logout dataAuth={dataProfile} />} />

          {/* admin routes */}
          {

          }
          <Route element={<AdminRoutes />}>
            <Route path="/admin/dashboard" element={<Main dataAuth={dataProfile} data_theme={isDark} />} >
              <Route index element={<CoursesAdmin dataAuth={dataProfile} />} />
              <Route path="courses" element={<><Outlet data_theme={isDark} /></>} >
                <Route path="" element={<CoursesAdmin data_theme={isDark} dataAuth={dataProfile} />} />
                <Route path="add" element={<AddCourseProvider><Add dataAuth={dataProfile} /></AddCourseProvider>} />
                <Route path=":course_id" element={<><Outlet /></>} >
                  <Route path="" element={<CourseDataProvider><CourseMainPageForAdmin data_theme={isDark ? "dark" : "light"} dataAuth={dataProfile} /></CourseDataProvider>} />
                </Route>
                <Route path=":course_id/edit" element={<EditCourseProvider><Edit dataAuth={dataProfile} /></EditCourseProvider>} />
              </Route>
              <Route path="payments" element={<Payments data_theme={isDark} dataAuth={dataProfile} />} />
              <Route path="users" element={<Users dataAuth={dataProfile} />} />
              <Route path="notifications" element={<NotificationProvider><NotificationsAdmin data_theme={isDark ? "dark" : "light"} dataAuth={dataProfile} /></NotificationProvider>} />
            </Route>
          </Route>


          {/* user */}
          <Route element={<ProfileRoutes />}>
            <Route path="/user/:user_id/profile" element={<UserProfile dataAuth={dataProfile} />} />
          </Route>

          {/* notifications */}
          <Route path="/notifications/:notification_id" element={<NotificationPage dataAuth={dataProfile} />} />

        </Routes>
        <Footer />
      </div>
    </SnackbarProvider>
  );
}

export default App;
