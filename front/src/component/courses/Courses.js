import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Title from "../title/Title";
import './courses.css'; // css file for this component use it only no any another file (ya 7omar) 
import { Course } from "../cards/Course_card";
import LoadingGradient from "../loading/Loading2";
import axiosInstance from "../../Axios";
import { useEffect, useState } from "react";
import ReloadBtn1 from "../inherit/ReloadBtn1";
import { $404 as Error404 } from "../errors/404";
import { Helmet } from "react-helmet";


function Courses(props) {
    const { grade } = useParams();
    const [courses, setCourses] = useState({
        err: { catch: false, msg: 'good connection' },
        courses: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        catch: false,
        status: 200,
        msg: 'good connection'
    });
    const [dataGrade, setDataGrade] = useState(null);

    const getCourses = () => {
        setLoading(true);
        axiosInstance
            .get(`/courses/grade/${grade}`)
            .then((response) => {
                setLoading(false);
                if (response.status === 200 || response.status === 201) {
                    setCourses({ err: { catch: false, msg: 'good connection' }, courses: response.data })
                } else {
                    setCourses({ err: { catch: true, msg: 'حدث خطأ ما حاول في وقت لاحق' }, courses: [] })
                }
            }).catch((err) => {
                setLoading(false);
                setCourses({ err: { catch: true, msg: 'حدث خطأ ما حاول في وقت لاحق' }, courses: [] })
            });
    }

    const getGradeInfo = () => {
        setLoading(true);
        axiosInstance
            .get(`/grades/grade/${grade}`)
            .then((response) => {
                setLoading(false);
                setDataGrade(response.data);
            })
            .catch((err) => {
                setLoading(false);
                setError({
                    catch: true,
                    status: err.response.status,
                    msg: 'لا يوجد بيانات في هذا المسار'
                });
            });
    }

    const getCoursesFormatter = () => {
        if (courses.err.catch === false) {
            if (courses.courses.length !== 0) {

                return (
                    courses.courses.map((course) => {
                        return (
                            <div key={course.id} className="card-cover col-lg-4 col-md-6 p-2">
                                <Course dataCourse={course} dataAuth={props.dataAuth} />
                            </div>
                        )
                    })
                )
            } else {
                return (
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center"><h3 className="text-danger d-flex flex-column gap-3">لم يتم تحميل اي كورس هنا حتي الأن <ReloadBtn1 onclick={getCourses} title='اعادة التحميل' /></h3></div>
                )
            }
        } else {
            return (
                <div className="w-100 h-100 d-flex justify-content-center align-items-center"><h3 className="text-danger d-flex flex-column gap-3">{courses.err.msg} <ReloadBtn1 onclick={getCourses} title='اعادة التحميل' /></h3></div>
            )
        }
    }

    useEffect(() => {
        getCourses();
        getGradeInfo();
    }, []);


    return (
        <section className="courses-section position-relative pb-5">
            <Helmet>
                <title>{
                    (dataGrade != null) ?
                        dataGrade.name
                        :
                        grade
                } - مجتمع الرياضيات</title>
            </Helmet>
            <Title
                colors={['var(--wave-default4)', 'var(--wave-default3)', 'var(--wave-default2)', 'var(--wave-default1)']}
                bgColor='var(--red-gradient)'
                title={
                    (dataGrade != null) ?
                        dataGrade.name
                        :
                        grade
                }
            />
            <Container className="course-container">
                <div className="content row mt-2 justify-content-center">
                    {(loading === false) ?
                        (error.catch === true) ?
                            <Error404 message={error.msg} />
                            :
                            getCoursesFormatter()
                        :
                        <LoadingGradient />}
                </div>
            </Container>
        </section>
    )
}

export default Courses;