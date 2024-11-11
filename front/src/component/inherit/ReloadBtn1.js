import { Button } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';

export default function ReloadBtn1(props) {
    return (
        <div dir="ltr" className="d-flex justify-content-center align-items-center mt-3">
            <Button onClick={props.onclick} variant="contained" size="large" endIcon={<ReplayIcon />} color="error">
                <span style={{'fontSize':'1.1em', 'color':'#fff'}}>{props.title}</span>
            </Button>
        </div>
    );
}
