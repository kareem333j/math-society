import { createContext, useEffect, useState } from "react";
import CourseDefaultBackground from '../assets/images/background/course-bg-default.png';


export const EditCourseContext = createContext();

function EditCourseProvider(props){
    // const course_id = props.course_id;
    const [dataCourse, setDataCourse] = useState({
        image: CourseDefaultBackground,
        image_to_server: null,
        new: true,
        is_active: true,
        notification: false,
        title: 'عنوان الكورس',
        description: 'وصف توضيحي للكورس',
        price_off: 1,
        price: 0.00,
        grade: 0
    });

    // useEffect(()=>{
    //     // get course data
    // }, [course_id])

    return(
        <EditCourseContext.Provider value={{dataCourse:dataCourse, setDataCourse:setDataCourse}}>
            {props.children}
        </EditCourseContext.Provider>
    )
}

export default EditCourseProvider;