import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../Axios';
import './course-view.css';
import Playlist from './Playlist';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import "plyr-react/plyr.css";
import { Container } from 'react-bootstrap';
import LoadingGradient from '../../loading/Loading2';
import { $403 as Error403 } from '../../errors/403';
import { $404 as Error404 } from '../../errors/404';



function ViewCourse(props) {
    const [course, setCourse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({
        catch: false,
        status:0 ,
        message: ''
    });
    const param = useParams()
    const courseId = param.course_id;
    const history = useNavigate();
    let location = useLocation();

    useEffect(() => {
        getCourseContent();
    }, [])

    const getCourseContent = () => {
        setLoading(true);
        axiosInstance
            .get(`courses/${courseId}/lectures`)
            .then((response) => {
                setCourse(response.data);
                setLoading(false);
            }).catch((err) => {
                setLoading(false);
                if (err.response.status === 404) {
                    setError({ catch: true, status: 404, message: 'عنوان خطأ لا يوجد بيانات في هذا المسار' });
                }
                else if (err.response.status === 403) {
                    setError({ catch: true, status: 403, message: err.response.data.detail });
                }
                else if (err.response.status === 401) {
                    history('/login', {state:{next: location.pathname}})
                    setError({ catch: true, status: 401, message: ''});
                }
                else{
                    setError({ catch: true, message: 'حدث خطأ ما تواصل مع الدعم..!' });
                }
            });
    }

    if (loading === true) {
        return <div className='w-100 d-flex justify-content-center align-items-center' style={{ 'backgroundColor': 'var(--color-dark-1)', 'minHeight': '70vh' }}>
            <LoadingGradient />
        </div>
    } else {
        if (error.catch === true) {
            if (error.status === 404) {
                return (
                    <Error404 message={error.message} />
                )
            } else if (error.status === 403) {
                return (
                    <Error403 message={error.message} />
                )
            } else {
                <Container style={{'backgroundColor':'var(--color-dark-2)'}}>
                    <div className='w-100 d-flex justify-content-center align-items-center' style={{ 'backgroundColor': 'var(--color-dark-1)', 'minHeight': '70vh' }}>
                        <span className='text-danger fw-bold text-center' dir='rtl' style={{ 'fontSize': '1.5em' }}>{error.message}</span>
                    </div>
                </Container>
            }
        } else {
            if (course.length <= 0) {
                return (
                    <Container>
                        <div className='w-100 d-flex justify-content-center align-items-center' style={{ 'backgroundColor': 'var(--color-dark-2)', 'minHeight': '70vh' }}>
                            <span className='text-danger fw-bold text-center' dir='rtl' style={{ 'fontSize': '1.5em' }}>لم يتم تنزيل اي محاضرة في هذا الكورس حتي الأن ..!</span>
                        </div>
                    </Container>
                )
            }
            return (
                <>
                    <Playlist data={course} courseId={courseId} dataAuth={props.dataAuth} />
                </>
            )
        }
    }
}

export default ViewCourse;









/* <Plyr
    options={options}
    source={
        {
            type: 'video',
            title: 'Example title',
            sources: [
                {
                    src: `http://127.0.0.1:8000/media/${course[1].content[0].video}`,
                    type: 'video/mp4',
                    size: 1080,
                }
            ],
        }
    }
/> */