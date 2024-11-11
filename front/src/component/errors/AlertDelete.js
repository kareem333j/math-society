import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';


export const AlertDelete = (props) => {
    // const navigate = useNavigate();
    withReactContent(Swal).fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((response) => {
        if (response.isConfirmed) {
            console.log(props.loading);
            if (props.loading === false) {
                if (props.action() === true) {
                    Swal.fire({
                        title: "! عملية ناجحة ",
                        text: "تم حذف الكورس بنجاح",
                        icon: "success",
                        confirmButtonText: 'تم'
                    });
                } else {
                    Swal.fire({
                        title: "فشلت عملية الحذف ",
                        text: "لقد حدث خطأ ما حاول في وقت لاحق",
                        icon: "error",
                        confirmButtonText: 'تم'
                    });
                }
            }

        }
    });
};