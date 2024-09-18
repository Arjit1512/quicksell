import React from 'react'
import './Card.css'
const Card = (props) => {
    return (
        <div className='card'>
            <h6>{props.cam}</h6>
            <h3>{props.title}</h3>
            <div className='flex-row'>
                <div className='silver-circle'></div>
                <p>{props.tag}</p>
            </div>
        </div>
    )
}

export default Card