import { Link } from "react-router-dom";
import './inherit.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';



export const SubscribeBtn = (props) => {
    // const isAuthenticated = props.dataAuth
    if (props.type === 'is_subscribed') {
        return (
            <>
                <button className="subscribe-btn w-100 text-center is_subscribed d-flex gap-2 justify-content-center align-items-center" onClick={props.onClick} style={{ 'backgroundColor': props.bgColor, 'color': props.color }}>
                    <AccessTimeIcon />
                    {props.name}
                </button>
            </>
        )
    }
    return (
        <>
            <Link className="subscribe-btn w-100 text-center" onClick={props.onClick} to={props.to} style={{ 'backgroundColor': props.bgColor, 'color': props.color }}>{props.name}</Link>
        </>
    )
}