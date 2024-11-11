import { Alert } from '@mui/material';
import './errors.css';

export default function FieldError(props) {
    return (
        <Alert variant="filled" severity="error" style={{'backgroundColor':'var(--red-error)'}}>
            <span className='me-2'>{props.msg}</span>
        </Alert>
    )
}