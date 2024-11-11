import React from 'react'
import { Link } from 'react-router-dom';

const CustomBtn1 = (props) => {
  return (
    <Link to={props.to} style={{'backgroundColor':props.bgColor, 'color':props.color}} className='CustomBtn1'>{props.name}</Link>
  )
}

export default CustomBtn1;