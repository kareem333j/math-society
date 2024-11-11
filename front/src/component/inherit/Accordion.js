import './inherit.css';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import QuizIcon from '@mui/icons-material/Quiz';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
})
);

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function Accordions(props) {
    const [expanded, setExpanded] = React.useState('panel1');
    const courseContent = props.data;


    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    //   const getCourseContent = ()=>{
    //     axiosInstance
    //     .get()
    //   }

    return (
        <div className='course-content-accordion'>
            {
                (courseContent.course.lectures).map((lecture) => {
                    return (
                        <Accordion key={lecture.id} expanded={expanded === `panel${lecture.id}`} onChange={handleChange(`panel${lecture.id}`)}>
                            <AccordionSummary aria-controls={`panel${lecture.id}d-content`} id={`panel${lecture.id}d-header`}>
                                <div className='d-flex flex-column me-3 accordion-title'>
                                    <span className='title'>{lecture.title}</span>
                                    <span className='description'>{lecture.description}</span>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className='d-flex flex-column lec-content'>
                                    {
                                        lecture.content.map((session, index) => {
                                            return <div key={index}>
                                                {
                                                    (session.type === 'video') ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" /></svg>
                                                        :
                                                        (session.type === 'document') ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z" /></svg>
                                                            :
                                                            (session.type === 'quiz') ?
                                                                <QuizIcon />
                                                                :
                                                                <></>
                                                }
                                                <span className='ms-3' style={{ 'fontSize': '1.1em' }}>
                                                    {session.title}
                                                </span>
                                                <span>
                                                    {
                                                        (session.type === 'video') ?
                                                            '( فيديو )'
                                                            :
                                                            (session.type === 'document') ?
                                                                '( pdf )'
                                                                :
                                                                (session.type === 'quiz') ?
                                                                    '( اختبار الكتروني )'
                                                                    :
                                                                    <></>
                                                    }
                                                </span>

                                            </div>
                                        })
                                    }
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    )
                })
            }
        </div>
    );
}
