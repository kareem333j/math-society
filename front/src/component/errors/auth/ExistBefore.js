import { Container } from "react-bootstrap";
import './auth.css'
import { Warning } from "../Warning2";
import CustomBtn1 from "../../inherit/CustomBtn1";


export const ExistBefore = (props)=>{
    return(
        <section className="isExist">
            <Container className="d-flex justify-content-center align-items-end flex-column">
                <Warning title={props.title} message={props.message} />
                <div className="d-flex gap-2 mt-3">
                    <CustomBtn1 to={props.actions.btn2.to} name={props.actions.btn2.name} bgColor={props.actions.btn2.bgColor} color={props.actions.btn2.color} />
                    <CustomBtn1 to={props.actions.btn1.to} name={props.actions.btn1.name} bgColor={props.actions.btn1.bgColor} color={props.actions.btn1.color} />
                </div>
            </Container>
        </section>
    )
}