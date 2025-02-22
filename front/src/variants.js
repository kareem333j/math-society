export const fadeIn = (direction="", delay=1)=>{
    return{
        hidden: {
            y : direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
            x : direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
            scale : direction === "scale_up" ? 0.8 : direction === "scale_down" ? 1.07: 1,
            opacity: 0.5,
        },
        show : {
            y: 0,
            x: 0,
            opacity: 1,
            scale : 1,
            transition:{
                type: 'tween',
                duration: 1.2,
                delay: delay,
                ease: [0.25, 0.25, 0.25, 0.75],
            }
        }
    }
}