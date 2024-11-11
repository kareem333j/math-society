import { Alert, AlertTitle } from "@mui/material"


export const Warning = (props) => {
    return (
        <Alert className="pb-0" id='warning-1' severity="warning" dir="rtl">
            <AlertTitle><h3 style={{'fontSize':'1.5em', 'marginRight':'4px'}}>{props.title}</h3></AlertTitle>
            <h5 className="p-0 m-0" style={{'fontSize':'1.3em'}}>{props.message}</h5>
        </Alert>
    )
}