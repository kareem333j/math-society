import '../header/header.css';

export default function ModeBtn({ handelMode, isChecked }) {
    return (
        <div className='mode-btn2'>
            <input onChange={handelMode} type="checkbox" id="toggle" className="toggle--checkbox" checked={isChecked} />
            <label style={{'cursor':'pointer'}} htmlFor="toggle" className="toggle--label">
                <span className="toggle--label-background"></span>
            </label>
        </div>
    )
}


/* <div className="wrapper" expand="sm">
    <input onChange={handelMode} checked={!isChecked} type="checkbox" id="hide-checkbox" />
    <label htmlFor="hide-checkbox" className="toggle">
        <span className="toggle-button">
            <span className="crater crater-1"></span>
            <span className="crater crater-2"></span>
            <span className="crater crater-3"></span>
            <span className="crater crater-4"></span>
            <span className="crater crater-5"></span>
            <span className="crater crater-6"></span>
            <span className="crater crater-7"></span>
        </span>
        <span className="star star-1"></span>
        <span className="star star-2"></span>
        <span className="star star-3"></span>
        <span className="star star-4"></span>
        <span className="star star-5"></span>
        <span className="star star-6"></span>
        <span className="star star-7"></span>
        <span className="star star-8"></span>
    </label>
</div> */