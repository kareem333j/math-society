import { TextField } from "@mui/material"
import '../../main.css';

export const CustomTextAreaField = (props) => {
    return (
        <TextField
            className="admin-field"
            id="outlined-multiline-static"
            label={props.label}
            multiline
            rows={props.rows}
            name={props.name}
            onChange={props.onChange}
            defaultValue={props.defaultValue}
            required={props.required}
        />
    )
}