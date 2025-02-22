import './App.css';
import './index.css';
import './component/header/header.css';
import { Container } from 'react-bootstrap';
import Einstein_img from './assets/images/section/Einstein.png';
import Mostafa from './assets/images/section/mostafa2.jpg';
import Panner from './component/Panner/Panner';
import Waves from './component/inherit/Waves';
import Text_background from './assets/images/section/text-background.png'
import Clock_img from './assets/images/section/clock.png';
import Loop_img from './assets/images/section/loop.png';
import Quiz_img from './assets/images/section/quiz.png';
import RedMainBtn from './component/inherit/MainBtn';
import { useEffect, useState } from 'react';
import { FaPlus, FaMinus, FaDivide, FaTimes, FaEquals, FaSquare, FaCircle } from 'react-icons/fa';
import { FaArrowUp } from 'react-icons/fa';
import Title from './component/title/Title';
import { NoteBox } from './component/inherit/Note-Box';
import { NoteBox2 } from './component/inherit/Note-Box2';
import Card1 from './component/cards/Card1';
import axiosInstance from './Axios';
import LoadingGradient from './component/loading/Loading2';
import ReloadBtn1 from './component/inherit/ReloadBtn1';
import { Helmet } from 'react-helmet';

// motion
import { motion } from 'framer-motion';
import { fadeIn } from './variants';

function Home({ dataAuth }) {
  const [scrollY, setScrollY] = useState(0);
  const [grades, setGrades] = useState({
    loading: false,
    catch: { 'error': false, message: '' },
    grades: null
  });

  useEffect(() => {
    getGrades();
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const icons = [FaPlus, FaMinus, FaDivide, FaTimes, FaEquals, FaSquare, FaCircle, FaArrowUp];

  const getGrades = () => {
    setGrades({
      loading: true, catch: { 'error': false, message: '' }, grades: null
    });
    axiosInstance
      .get('/grades')
      .then((response) => {
        setGrades({
          loading: false, catch: { 'error': false, message: '' }, grades: response.data
        })
      }).catch((err) => {
        setGrades({
          loading: false, catch: { 'error': true, message: 'لقد حدث خطأ ما حاول في وقت لاحق...!' }, grades: null
        });
      });
  }

  return (
    <>
      <Helmet>
        <title>الرئيسية - مجتمع الرياضيات</title>
      </Helmet>
      <div className='main-background'>
      </div>
      <section className='main-sec d-flex justify-content-center align-items-center'>
        <motion.div variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{once: false, amount: 0.7}}
         className='container content row d-flex align-items-center' dir='rtl'>
          <div className='data col-lg-12 col-md-12 col-12 d-flex justify-content-center align-items-center flex-column'>
            <h3 className='name fw-bold mb-4 text-center'>
              <span style={{ 'color': 'var(--red-light)' }}>م /</span>
              <br />
              <div className='position-relative'>
                <div className='back-img'>
                  <img className='img-fluid' src={Text_background} alt='' />
                </div>
                <span className='name2 position-relative' style={{ 'color': 'var(--text-cyan-700)' }}>مصطفي حمدي</span>
              </div>
            </h3>
            <h1 className='d-flex gap-2 m-0 title'>
              <span className='ch1'>مجتمع</span>
              <span className='ch2'>الرياضيات</span>
            </h1>
            <h5 className='slogn text-center'>مــــنصة متخــــصــــصــــة في
              <br />
              علم الرياضيات
            </h5>
            <div className='actions mt-4 d-flex gap-3'>
              {(dataAuth.isAuthenticated !== true) ? <RedMainBtn to='/register' name='إشترك الأن !' /> : <RedMainBtn href='#courses' name='الكورسات !' />}
              {
                (dataAuth.isAuthenticated !== true) ? <a href='#courses' className='flat-btn d-flex gap-1 align-items-center' dir='rtl'>
                  <span style={{ 'color': 'var(--color-default2)' }}>الصفوف </span>
                  <span style={{ 'color': 'var(--red-light)' }}>الدراسية</span>
                </a> : <></>
              }
            </div>
          </div>
        </motion.div>
      </section>
      <section className='sec2 d-flex justify-content-center align-items-center'>
        <Waves color={['var(--red-light000)', 'var(--red-light00)', 'var(--red-light0)', 'var(--red-light)']} />
        <Container className='p-0 d-flex justify-content-center align-items-center'>
          <Panner img={Mostafa} dir='rtl' paragraph='منصة مجتمع الرياضيات' h31='لشرح منهج الرياضيات' h32='للمرحلة الثانوية' color={{ 'color1': 'var(--color-white)', 'color2': 'var(--text-cyan-500)' }} />
        </Container>
      </section>

      <section className='sec3'>
        <div className='container'>
          <div className='row justify-content-center'>
            <NoteBox2 direction="right" once={true} img={Quiz_img} bgColor='var(--text-cyan-700)' col='col-lg-4' name='احضر امتحانات دورية ومستمرة' />
            <NoteBox2 direction="scale_up" once={true} img={Loop_img} bgColor='var(--red-light)' col='col-lg-4' name='شاهد دروسك اكتر من مرة' />
            <NoteBox2 direction="left" once={true} img={Clock_img} bgColor='var(--text-cyan-500)' col='col-lg-4' name='وفر وقت المواصلات والسنتر' />
          </div>
        </div>
      </section>
      <section className='sec4' id='courses'>
        <Title colors={['var(--wave-default4)', 'var(--wave-default3)', 'var(--wave-default2)', 'var(--wave-default1)']} bgColor='var(--red-gradient)' title='الصفوف الدراسية' />
        <Container className='d-flex justify-content-center align-items-center'>
          {
            (grades.loading === true) ?
              <LoadingGradient />
              :
              (grades.catch.error === true) ?
                <div className='d-flex justify-content-center align-items-center' style={{ 'minHeight': '35vh' }}>
                  <div dir='rtl' className="w-100 h-100 d-flex justify-content-center align-items-center"><h3 className="text-danger d-flex flex-column gap-3">{grades.catch.message}<ReloadBtn1 onclick={getGrades} title='اعادة التحميل' /></h3></div>
                </div>
                :
                (grades.grades === null) ?
                  <div className='d-flex justify-content-center align-items-center' style={{ 'minHeight': '35vh' }}>
                    <div dir='rtl' className="w-100 h-100 d-flex justify-content-center align-items-center"><h3 className="text-danger d-flex flex-column gap-3">لم يتم إدراج اي صفوف دراسية حتي الأن...!<ReloadBtn1 onclick={getGrades} title='اعادة التحميل' /></h3></div>
                  </div>
                  :
                  <div className='cards row'>
                    {
                      grades.grades.map((grade, i) => {
                        return (
                          <motion.div
                          variants={fadeIn("scale_up", 0.2)}
                          initial="hidden"
                          whileInView={"show"}
                          viewport={{ once: true, amount: 0.7 }}
                          key={i} className='col-lg-4 mb-5'>
                            <Card1 id={grade.id} title={grade.name} description={grade.description} />
                          </motion.div>
                        )
                      })
                    }
                  </div>
          }
        </Container>
      </section>
    </>
  );
}

export default Home;
