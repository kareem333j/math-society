import { Container } from 'react-bootstrap';
import './title.css';
import Waves from '../inherit/Waves';

const Title = (props) => {
    return (
        <div className='title-div' style={{'--background-title-new': props.bgColor}}>
            <Container>
                <div className='title text-end d-flex justify-content-end align-items-center position-relative'>
                    <h1>{props.title}</h1>
                    <h3>{props.title}</h3>
                </div>
            </Container>
            <div className='waves-div position-relative'>
            <Waves color={props.colors} />

            </div>
        </div>
    )
}

export default Title