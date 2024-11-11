import { FormControl, InputLabel, OutlinedInput } from "@mui/material"
import '../../main.css';


export const CustomNumberField = (props) => {
    return (
        <FormControl className="admin-field" fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">{props.label}</InputLabel>
            <OutlinedInput
                defaultValue={props.defaultValue}
                value={props.value}
                type={props.type}
                inputProps={props.inputProps}
                id="outlined-adornment-amount"
                startAdornment={props.icon}
                label={props.label}
                name={props.name}
                onChange={props.onChange}
                required
            />
        </FormControl>
    )
}