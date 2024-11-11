import { forwardRef, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Button, Dialog, IconButton, Slide, Toolbar, Tooltip, Typography } from "@mui/material";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function DialogScreen(props) {
    // const [open, setOpen] = useState(props.open);

    const handleClose = () => {
        props.setOpen(false);
    };


    return (
        <>
            <Dialog
                fullScreen
                open={props.open}
                onClose={handleClose}
                TransitionComponent={Transition}
                className="dialog-screen"
                data-theme={props.data_theme}
                id='dialog-screen'
            >
                <AppBar className='dialog-navbar' dir='rtl' sx={{ position: 'relative', backgroundColor: 'var(--color-dark-2)' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                            style={{'color':'var(--color-default2)'}}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ mr: 2, flex: 1, color:'var(--color-default2)' }} variant="h6" component="div">
                            {props.close_title}
                        </Typography>
                        {/* <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button> */}
                    </Toolbar>
                </AppBar>
                <props.component {...props} close={handleClose} />
            </Dialog>
        </>
    )
}