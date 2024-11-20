import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';


export const AlertSuccess = (props) => {
    // const navigate = useNavigate();
    withReactContent(Swal).fire({
        position: (props.position?props.position:"top-end"),
        icon: props.icon,
        title: props.title,
        text: props.text,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: props.btn,
    }).then((e)=>{
        props.action();
        if(props.reload === true) {
            if(e.isConfirmed){
                window.location.reload();
            };
        }
    });
};