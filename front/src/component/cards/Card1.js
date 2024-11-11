import { Link } from 'react-router-dom';
import './cards.css';

export default function Card1(props) {
  return (
    <div className='exam-card'>
      <div className='card-back'>
      </div>
      <Link to={`/courses/${props.id}`} className='exam-card-content'>
          <h3>{props.title}</h3>
          <hr className='my-2 p-0' />
          <h5>{props.description}</h5>
        </Link>
    </div>
  )
}