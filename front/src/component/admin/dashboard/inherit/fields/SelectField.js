import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import '../../main.css';


export const CustomSelectField = (props) => {
    return (
        <FormControl className="admin-field" required sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-required-label"> {props.label} </InputLabel>
            <Select
                dir='ltr'
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={props.value}
                defaultValue={props.defaultValue}
                label={props.label}
                onChange={props.onChange}
                name={props.name}
            >
                <MenuItem value="">
                    <em>-------</em>
                </MenuItem>
                {
                    
                    props.array.map((g) => {
                        return (
                            <MenuItem className='menu-select-item' key={g.id} value={g.id}>{g.name}</MenuItem>
                        )
                    })
                }
            </Select>
        </FormControl>
    )
}