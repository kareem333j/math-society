import { Button, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from "react";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export const CustomUploadField = (props) => {
    const [dataFile, setDataFile] = useState(null);

    const handleChange = (e)=>{
        setDataFile(e.target.files);
    }

    return (
        <div className="w-100 d-flex gap-3 align-items-center flex-wrap" dir={props.dir}>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{ 'gap': '10px' }}
                size={props.btnSize}
            >
                <span className="fw-bold">{props.label}</span>
                <VisuallyHiddenInput
                    type="file"
                    onChange={
                        (e)=>{
                            handleChange(e);
                            props.onChange(e);
                        }
                    }
                    // multiple
                    accept={props.accept}
                    required={props.required}
                    name={props.name}
                />
            </Button>
            <span className="overflow-hidden" style={{'color':'var(--color-default-50)', ...props.nullMSGStyle}}>
                {
                    (dataFile == null)? props.nullMSG
                    :
                    (dataFile[0] !== undefined) ? dataFile[0].name
                    :
                    props.nullMSG
                }
            </span>
        </div>
    )
}