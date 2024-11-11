import { useContext, useRef, useState } from "react";
import { DashboardMainBtn } from "../../../../inherit/DashboardMainBtn";
import { CustomSelectField } from "../../inherit/fields/SelectField";
import { CustomTextAreaField } from "../../inherit/fields/TextAreaField";
import { CustomTextField } from "../../inherit/fields/TextField";
import { CustomSwitchBtn } from "../../inherit/SwitchBtn";
import { adminCourseContext } from "../../../../../context/AdminCourseDataContext";
import { enqueueSnackbar } from "notistack";
import LinearIndeterminate from "../../../../loading/loading1";
import { CustomNumberField } from "../../inherit/fields/NumberField";
import { CustomUploadField } from "../../inherit/fields/UploadField";
import axiosInstance from "../../../../../Axios";
import { Button, Checkbox, FormControlLabel, IconButton, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { InputAdornment } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/material/styles';

const BpIcon = styled('span')(({ theme }) => ({
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '.Mui-focusVisible &': {
        outline: '2px auto rgba(19,124,189,.6)',
        outlineOffset: 2,
    },
    'input:hover ~ &': {
        backgroundColor: '#ebf1f5',
        ...theme.applyStyles('dark', {
            backgroundColor: '#30404d',
        }),
    },
    'input:disabled ~ &': {
        boxShadow: 'none',
        background: 'rgba(206,217,224,.5)',
        ...theme.applyStyles('dark', {
            background: 'rgba(57,75,89,.5)',
        }),
    },
    ...theme.applyStyles('dark', {
        boxShadow: '0 0 0 1px rgb(16 22 26 / 40%)',
        backgroundColor: '#394b59',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))',
    }),
}));

const BpCheckedIcon = styled(BpIcon)({
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&::before': {
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
            " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
            "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
        content: '""',
    },
    'input:hover ~ &': {
        backgroundColor: '#106ba3',
    },
});

function BpCheckbox(props) {
    return (
        <Checkbox
            sx={{ '&:hover': { bgcolor: 'transparent' } }}
            // disableRipple
            color="default"
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            inputProps={{ 'aria-label': 'Checkbox demo' }}
            {...props}
        />
    );
}

export const AddSessionForm = (props) => {
    const [loading, setLoading] = useState(false);
    const course_id = props.course_id;
    const course = useContext(adminCourseContext);
    const questionFixedProperties = {
        title: '',
        image: null,
        choices: [
            { id: 1, title: '', image: null, is_true: true },
            { id: 2, title: '', image: null, is_true: false },
            { id: 3, title: '', image: null, is_true: false },
            { id: 4, title: '', image: null, is_true: false },
        ],
    }
    const [questionsList, setQuestionsList] = useState([
        {
            id: 1,
            ...questionFixedProperties,
        },
        {
            id: 2,
            ...questionFixedProperties,
        }
    ]);
    const QSHeader = useRef();
    const [QSMore, setQSMore] = useState(true);
    const lectures = course.course.lectures;
    for (let lecture in lectures) {
        lectures[lecture]['name'] = lectures[lecture]['title'] + ` - ${course.course.title}`;
    }
    const sessionsType = [
        { 'id': 1, name: 'فيديو' },
        { 'id': 2, name: 'ملف' },
        { 'id': 3, name: 'اختبار إلكتروني' },
    ]
    const [data, setData] = useState({
        type: 1,
        lecture: '',
        title: '',
        description: '',
        priority: 0,
        active: true,
        notification: false,
        points: 0,
        time: 0,
        video: {
            videoEmbed: '',
        },
        document: {
            documentURL: '',
        },
        quiz: {
            questionsList: questionsList,
        },
    });

    // alerts
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'left',
    });
    const { vertical, horizontal, open } = state;
    const handleClickVariant = (variant, msg) => {
        enqueueSnackbar(msg, { variant: variant, anchorOrigin: { vertical, horizontal } });
    }


    const handleForm = (e) => {
        e.preventDefault();
        sendData();
    };

    const handleFormBtn = () => {
        if (data.type === 3) {
            QSHeader.current.classList.remove('off');
        }
    }



    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });

        if (e.target.name === 'active' || e.target.name === 'notification') {
            setData({
                ...data,

                [e.target.name]: e.target.checked,
            });
        }
    }

    const handleExtraChange = (e, type) => {
        if (type === 'video') {
            setData({
                ...data,
                'video': { [e.target.name]: e.target.value }
            })
        }
        else if (type === 'document') {
            setData({
                ...data,
                'document': { [e.target.name]: e.target.files[0] }
            })
        }
        else if (type === 'quiz') {
            setData({
                ...data,
                'questionsList': questionsList,
            })
        }
    }

    const reGet_course = () => {
        setLoading(true);
        axiosInstance
            .get(`admin/courses/course/${course_id}`)
            .then((response) => {
                setLoading(false);
                course.setCourse(response.data);
            })
            .catch((error) => {
                setLoading(false);
                handleClickVariant('error', 'هناك خطأ ما قد حدث');
            })
    }

    const sendData = () => {
        const config = {
            headers: {
                Authorization: localStorage.getItem('access_token')
                    ? 'JWT ' + localStorage.getItem('access_token')
                    : null,
                'Content-Type': 'multipart/form-data'
            }
        };

        let formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('active', data.active);
        formData.append('priority', data.priority);
        formData.append('notification', JSON.stringify(data.notification));
        formData.append('lecture', parseInt(data.lecture));
        if (data.type === 1) {
            formData.append('video_embed', data.video.videoEmbed);
            formData.append('type', 'video');
        }
        if (data.type === 2) {
            formData.append('document', data.document.documentURL);
            formData.append('type', 'document');
        }
        if (data.type === 3) {
            formData.append('type', 'quiz');
            formData.append('points', parseInt(data.points));
            formData.append('time', parseInt(data.time));

            formData.append('quiz', JSON.stringify(questionsList));
            questionsList.forEach((question) => {
                formData.append(`question_${question.id}_image`, question.image);
                question.choices.forEach((choice) => {
                    formData.append(`question_${question.id}_choice_${choice.id}_image`, choice.image);
                });
            });
        }
        setLoading(true);
        axiosInstance
            .post(`admin/courses/lectures/sessions/add`, formData, config)
            .then((response) => {
                setLoading(false);
                props.close();
                reGet_course();
                handleClickVariant('success', 'تم إضافة الحصة بنجاح');
            })
            .catch((error) => {
                setLoading(false);
                handleClickVariant('error', 'هناك خطأ ما قد حدث');
            });
    }

    const videoFields = () => {
        return (
            <>
                <div className="input-div" dir="rtl">
                    <CustomTextAreaField
                        label="كود الفيديو <embed code>"
                        rows={4}
                        name="videoEmbed"
                        onChange={(e) => { handleExtraChange(e, 'video') }}
                        required={true}
                    />
                </div>
            </>
        )
    }

    const documentFields = () => {
        return (
            <>
                <div className="input-div w-100 py-3 pe-2 justify-content-start" dir="rtl">
                    <CustomUploadField
                        label='تحميل ملف (pdf.)'
                        required={true}
                        onChange={(e) => { handleExtraChange(e, 'document') }}
                        name="documentURL"
                        accept='.pdf'
                        nullMSG='لم تقم بتحميل اي ملف'
                        nullMSGStyle={{ 'fontSize': '1.1em' }}
                        btnSize='medium'
                    />
                </div>
            </>
        )
    }

    const Question = (q_id, index) => {
        return (
            <div key={q_id} className="w-100 question mb-4 flex-column d-flex justify-content-center align-items-center">
                <div className="q-title p-0 d-flex justify-content-center align-items-center flex-column" style={{ 'width': '99%' }} dir="rtl">
                    <span className="w-100 d-flex justify-content-between align-items-center">
                        <span className="w-100 fw-bold">{index + 1} -</span>
                        <IconButton id={q_id} onClick={(e) => removeQuestionBtn(index)} color={(questionsList.length > 2) ? 'inherit' : 'disabled'} aria-label="delete" size="medium">
                            <DeleteIcon id={q_id} fontSize="medium" />
                        </IconButton>
                    </span>
                    <CustomTextField
                        label='عنوان السؤال'
                        name='title'
                        onChange={(e) => handleQFieldsChange(e, q_id)}
                    />
                    <CustomUploadField
                        label='إضافة صورة (اختياري)'
                        required={false}
                        onChange={(e) => handleQFieldsChange(e, q_id)}
                        name="image"
                        accept='.png, .jpg'
                        nullMSG='لم تقم بتحميل اي صورة'
                        nullMSGStyle={{ 'fontSize': '0.8em' }}
                        btnSize='small'
                    />
                </div>
                <div style={{ 'width': '99%' }} className="choices row p-0 d-flex justify-content-center align-items-center">
                    <div className="col-lg-6 choice p-0 m-0">
                        <CustomTextField
                            label={`اختيار رقم 1`}
                            name='title'
                            defaultValue={questionsList[index].title}
                            sx={{ 'padding': '0px 4px 0px 0px !important', 'margin': '10px 0 !important' }}
                            className='choice-input'
                            onChange={(e) => { handleChoiceChange(e, q_id, 1) }}
                        />
                        <div dir="rtl" className="w-100 text-light choice-is-true">
                            <BpCheckbox value={questionsList[index].choices[0].is_true} checked={questionsList[index].choices[0].is_true} name="is_true" onClick={(e) => { handleChoiceChange(e, q_id, 1) }} id={`ch1_${q_id}`} />
                            <label style={{ 'cursor': 'pointer' }} htmlFor={`ch1_${q_id}`}>اختيار صحيح</label>
                        </div>
                        <CustomUploadField
                            dir='rtl'
                            label='إضافة صورة (اختياري)'
                            required={false}
                            onChange={(e) => { handleChoiceChange(e, q_id, 1) }}
                            name="image"
                            accept='.png, .jpg'
                            nullMSG='لم تقم بتحميل اي صورة'
                            nullMSGStyle={{ 'fontSize': '0.8em' }}
                            btnSize='small'
                        />
                    </div>
                    <div className="col-lg-6 choice p-0">
                        <CustomTextField
                            label={`اختيار رقم 2`}
                            name='title'
                            sx={{ 'padding': '0px !important', 'margin': '10px 0px !important' }}
                            className='choice-input'
                            onChange={(e) => { handleChoiceChange(e, q_id, 2) }}
                        />
                        <div dir="rtl" className="w-100 text-light choice-is-true">
                            <BpCheckbox value={questionsList[index].choices[1].is_true} checked={questionsList[index].choices[1].is_true} name="is_true" onClick={(e) => { handleChoiceChange(e, q_id, 2) }} id={`ch2_${q_id}`} />
                            <label style={{ 'cursor': 'pointer' }} htmlFor={`ch2_${q_id}`}>اختيار صحيح</label>
                        </div>
                        <CustomUploadField
                            dir='rtl'
                            label='إضافة صورة (اختياري)'
                            required={false}
                            onChange={(e) => { handleChoiceChange(e, q_id, 2) }}
                            name="image"
                            accept='.png, .jpg'
                            nullMSG='لم تقم بتحميل اي صورة'
                            nullMSGStyle={{ 'fontSize': '0.8em' }}
                            btnSize='small'
                        />
                    </div>
                    <div className="col-lg-6 choice p-0">
                        <CustomTextField
                            label={`اختيار رقم 3`}
                            name='title'
                            sx={{ 'padding': '0px 4px 0px 0px !important', 'margin': '10px 0px !important' }}
                            className='choice-input'
                            onChange={(e) => { handleChoiceChange(e, q_id, 3) }}
                        />
                        <div dir="rtl" className="w-100 text-light choice-is-true">
                            <BpCheckbox value={questionsList[index].choices[2].is_true} checked={questionsList[index].choices[2].is_true} name="is_true" onClick={(e) => { handleChoiceChange(e, q_id, 3) }} id={`ch3_${q_id}`} />
                            <label style={{ 'cursor': 'pointer' }} htmlFor={`ch3_${q_id}`}>اختيار صحيح</label>
                        </div>
                        <CustomUploadField
                            dir='rtl'
                            label='إضافة صورة (اختياري)'
                            required={false}
                            onChange={(e) => { handleChoiceChange(e, q_id, 3) }}
                            name="image"
                            accept='.png, .jpg'
                            nullMSG='لم تقم بتحميل اي صورة'
                            nullMSGStyle={{ 'fontSize': '0.8em' }}
                            btnSize='small'
                        />
                    </div>
                    <div className="col-lg-6 choice p-0">
                        <CustomTextField
                            label={`اختيار رقم 4`}
                            name='title'
                            sx={{ 'padding': '0px !important', 'margin': '10px 0px !important' }}
                            className='choice-input'
                            onChange={(e) => { handleChoiceChange(e, q_id, 4) }}
                        />
                        <div dir="rtl" className="w-100 text-light choice-is-true">
                            <BpCheckbox value={questionsList[index].choices[3].is_true} checked={questionsList[index].choices[3].is_true} name="is_true" onClick={(e) => { handleChoiceChange(e, q_id, 4) }} id={`ch4_${q_id}`} />
                            <label style={{ 'cursor': 'pointer' }} htmlFor={`ch4_${q_id}`}>اختيار صحيح</label>
                        </div>
                        <CustomUploadField
                            dir='rtl'
                            label='إضافة صورة (اختياري)'
                            required={false}
                            onChange={(e) => { handleChoiceChange(e, q_id, 4) }}
                            name="image"
                            accept='.png, .jpg'
                            nullMSG='لم تقم بتحميل اي صورة'
                            nullMSGStyle={{ 'fontSize': '0.8em' }}
                            btnSize='small'
                        />
                    </div>


                </div>
            </div>
        )
    }

    const quizFields = () => {
        return (
            <>
                <div className="input-div" dir="rtl">
                    <CustomNumberField
                        label='النقاط'
                        name='points'
                        inputProps={{ min: 0 }}
                        type='number'
                        onChange={handleChange}
                    />
                </div>
                <div className="input-div" dir="rtl">
                    <CustomNumberField
                        label='الوقت (بالثواني)'
                        name='time'
                        inputProps={{ min: 0 }}
                        type='number'
                        onChange={handleChange}
                        icon={<InputAdornment className='pe-2' position="start">ث</InputAdornment>}
                        defaultValue={0}
                    />
                </div>
                <div ref={QSHeader} className="d-flex flex-column my-2 questions">
                    <h3 className="w-100 py-4 text-end px-2 d-flex align-items-center justify-content-end gap-3" style={{ 'color': 'var(--color-default2)', 'fontSize': '1.3em' }}>
                        <span dir="rtl">
                            الأسئلة
                            <span style={{ 'color': 'var(--tw-gradient-from)' }}>({questionsList.length})</span>
                        </span>
                        <IconButton
                            size="small"
                            edge="start"
                            color="inherit"
                            aria-label="see"
                            className='custom-edit-button options-btn'
                            onClick={(e) => {
                                if (QSHeader.current !== undefined) {
                                    QSHeader.current.classList.toggle('off');
                                    setQSMore(!QSMore);
                                }
                            }}
                        >
                            {
                                (QSMore) ?
                                    <ExpandMoreIcon size='large' />
                                    :
                                    <ExpandLessIcon size='large' />
                            }

                        </IconButton>
                    </h3>
                    <div id="questions" className="w-100 d-flex flex-column px-2 mb-4">
                        {
                            questionsList.map((q, i) => {
                                return Question(q.id, i);
                            })
                        }
                    </div>
                    <div className="w-100 px-3 mb-3" dir="rtl">
                        <Button className='d-flex justify-content-center align-items-center gap-2' onClick={AddQuestionBtn} variant="contained" sx={{ 'fontSize': '1em', }} startIcon={<AddIcon />}>
                            إضافة سؤال
                        </Button>
                    </div>
                </div>
            </>
        )
    }

    const AddQuestionBtn = () => {
        setQuestionsList([
            ...questionsList,
            {
                id: questionsList[questionsList.length - 1].id + 1,
                ...questionFixedProperties,
            }
        ]);
    }

    const removeQuestionBtn = (q_id) => { // [1,2,3,4,5]
        if (questionsList.length > 2) {
            const updatedList = questionsList.filter(item => item !== questionsList[q_id]);
            setQuestionsList(updatedList)
        }
    }

    const handleQFieldsChange = (e, id) => {
        const updatedItems = questionsList.map((item) =>
            item.id === id ? {
                ...item, [e.target.name]: (e.target.name === 'image') ?
                    (e.target.files[0] === undefined) ?
                        null : e.target.files[0] : e.target.value
            } : item
        );
        setQuestionsList(updatedItems);
    }

    const handleChoiceChange = (e, id, ch_id) => {
        const updatedItems = questionsList.map((item) =>
            item.id === id ? {
                ...item, choices:
                    item.choices.map((choice) => {
                        return choice.id === ch_id ? {
                            ...choice, [e.target.name]: (e.target.name === 'image') ?
                                (e.target.files[0] === undefined) ?
                                    null : e.target.files[0] : (e.target.name === 'is_true')?
                                    e.target.checked: e.target.value
                        } : choice
                    })
            } : item
        );
        setQuestionsList(updatedItems);
    };

    return (
        <div className='w-100 dialog-content session-forms'>
            <LinearIndeterminate load={loading} />
            <div className="container general-div-inputs ">
                <div className="title w-100 d-flex justify-content-center align-items-center">إضافة حصة جديدة</div>
                <form className='w-100 py-5' onSubmit={handleForm}>
                    <div className="input-div" dir="rtl">
                        <CustomSelectField
                            value={data.type}
                            label="اختر نوع الحصة"
                            onChange={handleChange}
                            name="type"
                            array={sessionsType}
                        />
                    </div>
                    <div className="input-div" dir="rtl">
                        <CustomSelectField
                            value={data.lecture}
                            label="اخنر المحاضرة التابع لها"
                            onChange={handleChange}
                            name="lecture"
                            array={lectures}
                        />
                    </div>
                    <div className="col-lg-12 input-div" dir="rtl">
                        <CustomTextField
                            label="عنوان الحصة"
                            name="title"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-div" dir="rtl">
                        <CustomNumberField
                            label='الأولوية'
                            name='priority'
                            inputProps={{ min: 0, max: 50 }}
                            type='number'
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-div" dir="rtl">
                        <CustomTextAreaField
                            label="الوصف"
                            rows={4}
                            name="description"
                            onChange={handleChange}
                            required={false}
                        />
                    </div>

                    <div className="extra-fields w-100">
                        {
                            (data.type === 1) ? videoFields() :
                                (data.type === 2) ? documentFields() :
                                    (data.type === 3) ? quizFields() :
                                        <></>
                        }
                    </div>

                    <div className="p-1 switch-buttons">
                        <CustomSwitchBtn defaultChecked={true} name='active' onClick={handleChange} title='تفعيل (حيث ان الحصة ستظهر للجميع)' />
                    </div>
                    <div className="p-1 switch-buttons mb-5">
                        <CustomSwitchBtn defaultChecked={false} name='notification' onClick={handleChange} title='إرسال إشعار لجميع المشتركين بهذا الكورس بشأن إضافة هذه الحصة' />
                    </div>
                    <div className="input-div p-1" dir="rtl">
                        <DashboardMainBtn onClick={handleFormBtn} name='إضافة' bgColor='var(--fill-button-gradient)' hover='var(--tw-gradient-from)' />
                    </div>
                </form>
            </div>
        </div>
    )
}