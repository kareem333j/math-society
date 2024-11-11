import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axiosInstance from '../../../../Axios';
import { CourseCard } from './courses-pages/inherit/CourseCard';
import ReloadBtn1 from '../../../inherit/ReloadBtn1';
import LoadingGradient from '../../../loading/Loading2';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { SearchBar } from '../inherit/SearchBar';


export default function CoursesAdmin(props) {
    const [courses, setCourses] = useState({
        err: { catch: false, msg: 'good connection' },
        courses: [],
    });
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal, open } = state;
    const [refreshCourses, setRefreshCourses] = useState(false);
    const [userSearched, setUserSearched] = useState(false);

    const handleClickVariant = (variant, msg) => {
        enqueueSnackbar(msg, { variant: variant, anchorOrigin: { vertical, horizontal } });
    }


    const getCourses = () => {
        setLoading(true);
        axiosInstance
            .get('/admin/courses')
            .then((response) => {
                setUserSearched(false);
                setLoading(false);
                if (response.status === 200 || response.status === 201) {
                    setCourses({ err: { catch: false, msg: 'good connection' }, courses: response.data })
                } else {
                    setCourses({ err: { catch: true, msg: 'حدث خطأ ما حاول في وقت لاحق' }, courses: [] })
                }
            }).catch((err) => {
                setUserSearched(false);
                setLoading(false);
                setCourses({ err: { catch: true, msg: 'حدث خطأ ما حاول في وقت لاحق' }, courses: [] })
            });
    }
    useEffect(() => {
        if (location.state != null) {
            handleClickVariant('success', location.state);
            location.state = null;
        }

        getCourses();

        if (refreshCourses === true) {
            getCourses();
        }
    }, [refreshCourses]);


    const handleSearchChange = (e) => {
        var text = e.target.value;
        let text_without_spacing = text.replace(/\s+/g, '');
        var value = text;

        if (text_without_spacing === '') {
            value = null;
        }

        axiosInstance
            .get(`admin/courses/search/${value}`)
            .then((response) => {
                setUserSearched(true);
                setCourses({ err: { catch: false, msg: 'good connection' }, courses: response.data })
            })
            .catch((error) => {
                setUserSearched(true);
                setCourses({ err: { catch: false, msg: 'good connection' }, courses: [] })
            });
    }

    const getCoursesFormatter = () => {
        if (courses.err.catch === false) {
            if (courses.courses.length !== 0) {

                return (
                    courses.courses.map((course) => {
                        return (
                            <div key={course.id} className="card-cover col-lg-4 col-md-6 p-2">
                                <CourseCard data_theme={props.data_theme} refresh={setRefreshCourses} dataCourse={course} />
                            </div>
                        )
                    })
                )
            } else {
                return (
                    <div style={{ 'minHeight': '50vh' }} className='d-flex justify-content-center align-items-center'>
                        <span style={{ 'fontSize': '1.7em', 'color': 'var(--text-cyan-700)' }}>
                            {
                                (userSearched) ?
                                    'لا يوجد اي كورس بهذه البيانات'
                                    :
                                    'لا يوجد اي كورس حتي الأن'
                            }
                        </span>
                    </div>
                )
            }
        } else {
            return (
                <div className="w-100 h-100 d-flex justify-content-center align-items-center"><h3 className="text-danger d-flex flex-column gap-3">{courses.err.msg} <ReloadBtn1 onclick={getCourses} title='اعادة التحميل' /></h3></div>
            )
        }
    }

    return (
        <SnackbarProvider maxSnack={3}>
            <div className="admin-courses static-div-style d-flex justify-content-center align-items-center flex-column">
                <div className='options d-flex w-100 align-items-center row'>
                    <div className='col-lg-4 position-relative col-5 p-0'>
                        <Button component={Link} to={'/admin/dashboard/courses/add'} dir='ltr' id='admin-main-btn1' variant="contained" sx={{ 'fontWeight': 'bold' }} size='medium'>
                            <AddIcon />
                        </Button>
                    </div>
                    <div className='col-lg-8 admin-search col-7 p-0'>
                        <SearchBar
                            placeholder="ابحث عن كورس..."
                            onChange={handleSearchChange}
                        />
                    </div>

                </div>
                <div className="position-relative pb-5">
                    <div className="row mt-2 justify-content-center pt-3">
                        {(loading === false) ? getCoursesFormatter() : <LoadingGradient />}
                    </div>
                </div>
            </div>
        </SnackbarProvider>
    )
}