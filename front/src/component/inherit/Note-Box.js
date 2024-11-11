import '../../assets/css/global.css';

export const NoteBox = (props) => {
  
  return (
    <div id='note-box' className={props.col}>
        <div className='image'>
            <img style={{'backgroundColor':props.bgColor}} className='img-fluid' src={props.img} alt='box' />
        </div>
        <h3 style={{'backgroundColor':props.bgColor,'transform':props.rotate,}}>{props.name}</h3>
    </div>
  )
}
