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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


export default function CoursesAdmin(props) {
    const [grades, setGrades] = useState({
        err: { catch: false, msg: 'good connection' },
        grades: [],
    });
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
                    setGrades({ err: { catch: false, msg: 'good connection' }, grades: response.data });

                } else {
                    setGrades({ err: { catch: true, msg: 'حدث خطأ ما حاول في وقت لاحق' }, grades: [] });
                }
            }).catch((err) => {
                setUserSearched(false);
                setLoading(false);
                setGrades({ err: { catch: true, msg: 'حدث خطأ ما حاول في وقت لاحق' }, grades: [] })
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
            .catch(() => {
                setUserSearched(true);
                setCourses({ err: { catch: true, msg: 'حدث خطأ ما حاول في وقت لاحق' }, courses: [] })
            });

        if (value === null || value.length === 0) {
            setUserSearched(false);
            getCourses();
        }
    }

    const getCoursesFormatter = () => {
        if (!userSearched) {
            if (grades.err.catch === false) {
                if (grades.grades.length !== 0) {
                    return grades.grades.map((grade) => {
                        return (
                            <div key={grade.id} className='w-100 courses-section d-flex flex-column mt-2'>
                                <div
                                    onClick={(e) => {
                                        const coursesDiv = e.target.closest('.title').nextElementSibling;
                                        if (coursesDiv) {
                                            coursesDiv.classList.toggle('shrink');
                                        }
                                    }}
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
                                    {grade.name}
                                    <span style={{ backgroundColor: 'red', padding: '2px 9px', borderRadius: '100%' }}>{grade.courses.length}</span>
                                </div>
                                <div className='courses shrink row mt-2 justify-content-center pt-3 pb-2'>
                                    {grade.courses.length > 0 ? (
                                        grade.courses.map((course) => {
                                            return (
                                                <div key={course.id} className='card-cover col-lg-4 col-md-6 p-2'>
                                                    <CourseCard
                                                        data_theme={props.data_theme}
                                                        refresh={setRefreshCourses}
                                                        dataCourse={course}
                                                    />
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className='text-center' style={{ color: 'var(--text-cyan-700)', fontSize: '1.2em', padding: '20px' }}>
                                            لا يوجد كورسات لهذا الصف
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    });
                } else {
                    return (
                        <div style={{ minHeight: '50vh' }} className='d-flex justify-content-center align-items-center'>
                            <span style={{ fontSize: '1.7em', color: 'var(--text-cyan-700)' }}>
                                {userSearched ? 'لا يوجد أي كورس بهذه البيانات' : 'لا يوجد أي كورس حتى الآن'}
                            </span>
                        </div>
                    );
                }
            } else {
                return (
                    <div className='w-100 h-100 d-flex justify-content-center align-items-center'>
                        <h3 className='text-danger d-flex flex-column gap-3'>
                            {grades.err.msg} <ReloadBtn1 onclick={getCourses} title='إعادة التحميل' />
                        </h3>
                    </div>
                );
            }
        }
        else {
            return (
                <div className='courses shrink row mt-2 justify-content-center pt-3 pb-2'>
                    {courses.courses.length > 0 ? (
                        courses.courses.map((course) => {
                            return (
                                <div key={course.id} className='card-cover col-lg-4 col-md-6 p-2'>
                                    <CourseCard
                                        data_theme={props.data_theme}
                                        refresh={setRefreshCourses}
                                        dataCourse={course}
                                    />
                                </div>
                            )
                        })
                    ) : (
                        <div className='text-center' style={{ color: 'var(--text-cyan-700)', fontSize: '1.2em', padding: '20px' }}>
                            لا يوجد كورسات بهذا الاسم
                        </div>
                    )}
                </div>
            )
        }
    };

    return (
        <SnackbarProvider maxSnack={3}>
            <div className="admin-courses static-div-style d-flex justify-content-center align-items-center flex-column">
                <div className='options d-flex w-100 align-items-center row'>
                    <div className='col-lg-4 position-relative col-5 p-0'>
                        <Button component={Link} to={'/admin/dashboard/courses/add'} dir='ltr' id='admin-main-btn1' variant="contained" sx={{ 'fontWeight': 'bold' }} size='medium'>
                            <AddIcon />
                        </Button>
                    </div>
                    <div className='col-lg-8 admin-search col-7 p-0 d-flex'>
                        <SearchBar
                            placeholder="ابحث عن كورس..."
                            onChange={handleSearchChange}
                        />
                    </div>

                </div>
                <div className="position-relative">
                    {/* <div className="row mt-2 justify-content-center pt-3">{(loading === false) ? getCoursesFormatter() : <LoadingGradient />}</div> */}
                    <div className="w-100 justify-content-center">
                        {(loading === false) ? getCoursesFormatter() : <LoadingGradient />}
                    </div>
                </div>
            </div>
        </SnackbarProvider>
    )
}