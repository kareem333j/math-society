import { Link } from 'react-router-dom';
import './inherit.css';

export default function NonFillBtn(props){
    return (
        <Link to={props.to} className='gradient-btn1 non-fill-btn m-0'>{props.name}</Link>
    )
}