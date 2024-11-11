import React from 'react';
import { Row } from 'react-bootstrap';
import './panner.css';


const Panner = (props) => {
  return (
    <Row className='panner' dir={props.dir}>
        <div className='col-lg-5 col-sm-6 col-md-5 col-6'>
          <div className="panner-avatar w-100">
            <img className='img-fluid' src={props.img} alt='img' />
          </div>
        </div>
        <div className='data col-lg-7 col-sm-6 col-md-7 col-6 d-flex justify-content-center align-items-start flex-column'>
            <h5 style={{'color':props.color.color1}}>{props.paragraph}</h5>
            <h3 className='d-inline-block fw-bold'>
                <span style={{'color':props.color.color2, 'display':'inline-block', 'margin':'5px'}}>{props.h31}</span>
                <span style={{'color':props.color.color1, 'display':'inline-block'}}>{props.h32}</span>
            </h3>
        </div>
    </Row>
  )
}

export default Panner;