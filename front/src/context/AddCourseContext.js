import { createContext, useState } from "react";
import CourseDefaultBackground from '../assets/images/background/course-bg-default.png';


export const AddCourseContext = createContext();

function AddCourseProvider(props){
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

    return(
        <AddCourseContext.Provider value={{dataCourse:dataCourse, setDataCourse:setDataCourse}}>
            {props.children}
        </AddCourseContext.Provider>
    )
}

export default AddCourseProvider;