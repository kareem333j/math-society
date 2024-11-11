import { TextField } from "@mui/material"
import '../../main.css';


export const CustomTextField = (props) => {
    return (
        <TextField
            dir="rtl"
            id="outlined-basic"
            className={`admin-field ${props.className}`}
            label={props.label}
            variant="outlined"
            name={props.name}
            onChange={props.onChange}
            defaultValue={props.defaultValue}
            required
            sx={props.sx}
            value={props.value}
        />
    )
}