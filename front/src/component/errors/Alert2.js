import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';
import cat_gif from '../../assets/images/gif/nyan-cat-nyan.gif'


export const AlertSuccess2 = (props) => {
    withReactContent(Swal).fire({
        title: props.title,
        text: props.text,
        html: props.html,
        confirmButtonText: props.btn,
        width: 600,
        padding: "3em",
        color: "ُ#fff",
        background: "#fff",
        backdrop: `
          rgba(0,0,123,0.4)
          url(${cat_gif})
          left top
          no-repeat
        `
    }).then(props.action);
};