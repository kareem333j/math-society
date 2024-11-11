import { createContext, useState } from "react";


export const adminCourseContext = createContext();

const CourseDataProvider = (props)=>{
    const [course, setCourse] = useState({});

    return(
        <adminCourseContext.Provider value={{course:course, setCourse:setCourse}}>
            {props.children}
        </adminCourseContext.Provider>
    )
}

export default CourseDataProvider;