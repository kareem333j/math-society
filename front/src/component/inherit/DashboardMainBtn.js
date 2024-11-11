import './inherit.css'

export const DashboardMainBtn = (props)=>{
    return(
        <button className='dashboard-main-btn' onClick={props.onClick} style={{'background':props.bgColor, 'color':"#fff",'--hover-admin-btn':props.hover}} data-hover={props.hover}>{props.name}</button>
    )
}