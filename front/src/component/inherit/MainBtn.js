import '../header/header.css';
import '../../App.css';
import { Link } from 'react-router-dom';

export default function RedMainBtn(props) {
    if (props.to) {
        return (
            <Link to={props.to} id='main-btn-red' onClick={props.onClick} className='d-flex gap-2 justify-content-center align-items-center' dir='rtl'>
                {props.icon}
                <span>{props.name}</span>
            </Link>
        )
    } else {
        // this button use in #hash links
        return (
            <a href={props.href} id='main-btn-red' className='d-flex gap-2 justify-content-center align-items-center' dir='rtl'>
                {props.icon}
                <span>{props.name}</span>
            </a>
        )
    }

}