import { createContext, useState } from "react";


export const NotificationContext = createContext();

const NotificationProvider =  (props)=>{
    const [notifications, setNotifications] = useState(null);

    return(
        <NotificationContext.Provider value={{notifications:notifications, setNotifications:setNotifications}}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export default NotificationProvider;