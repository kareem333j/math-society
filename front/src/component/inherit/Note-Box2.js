import React from 'react';
import '../../assets/css/global.css';

// motion
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';

export const NoteBox2 = (props) => {
    return (
        <motion.div
        variants={fadeIn(props.direction, 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: props.once, amount: 0.7 }}
        className={`note-box2 ${props.col}`}>
            <div className='box'>
                <div className='image'>
                    <img style={{ 'backgroundColor': props.bgColor }} src={props.img} alt='box' />
                </div>
                <h3>{props.name}</h3>
            </div>
        </motion.div>
    )
}
