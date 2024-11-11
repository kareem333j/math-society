import { Link } from 'react-router-dom';
import './inherit.css';

export default function FillBtn(props){
    const dataAuth = props.dataAuth;

    return (
        <Link to={(dataAuth === true)? props.to: '/register'} className='gradient-btn1 fill-btn'>{props.name}</Link>
    )
}