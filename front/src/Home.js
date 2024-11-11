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
import Card1 from './component/cards/Card1';
import axiosInstance from './Axios';
import LoadingGradient from './component/loading/Loading2';
import ReloadBtn1 from './component/inherit/ReloadBtn1';



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
      <div className='main-background'>
      </div>
      <section className='main-sec d-flex justify-content-center align-items-center'>
        <div className='container content row d-flex align-items-center' dir='rtl'>
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
            <div className='actions mt-4'>
              {(dataAuth.isAuthenticated !== true) ? <RedMainBtn to='/register' name='إشترك الأن !' /> : <RedMainBtn href='#courses' name='الكورسات !' />}
            </div>
          </div>
        </div>


      </section>
      <section className='sec2 d-flex justify-content-center align-items-center'>
        <Waves color={['var(--red-light000)', 'var(--red-light00)', 'var(--red-light0)', 'var(--red-light)']} />
        <Container className='p-0 d-flex justify-content-center align-items-center'>
          <Panner img={Mostafa} dir='rtl' paragraph='منصة مجتمع الرياضيات' h31='لشرح منهج الرياضيات' h32='للمرحلة الثانوية' color={{ 'color1': 'var(--color-white)', 'color2': 'var(--text-cyan-500)' }} />
        </Container>
      </section>

      <section className='sec3'>
        <div
          className='pattern-container'
          style={{
            transform: `translateY(${scrollY * 0.00001}px)` // تبطيء حركة التمرير بشكل أكبر
          }}
        >
          {[...Array(15)].map((_, index) => {
            const IconComponent = icons[Math.floor(Math.random() * icons.length)];
            return (
              <div
                className='pattern-item'
                key={index}
                style={{
                  left: `${Math.random() * 90}vw`, // توزيع عشوائي عبر العرض
                  top: `${Math.random() * 90}vh`, // توزيع عشوائي عبر الارتفاع
                  fontSize: '2rem', // حجم ثابت للرموز
                }}
              >
                <IconComponent />
              </div>
            );
          })}
        </div>

        <div className='row notes justify-content-center gap-5'>
          <NoteBox rotate='rotate(15deg)' bgColor='var(--text-cyan-700)' img={Quiz_img} col='col-lg-3' name='احضر امتحانات دورية ومستمرة' />
          <NoteBox rotate='rotate(-10deg)' bgColor='var(--red-light)' img={Loop_img} col='col-lg-3' name='شاهد دروسك اكتر من مرة' />
          <NoteBox rotate='rotate(10deg)' bgColor='var(--text-cyan-500)' img={Clock_img} col='col-lg-3' name='وفر وقت المواصلات والسنتر' />
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
                          <div key={i} className='col-lg-4 mb-5'>
                            <Card1 id={grade.id} title={grade.name} description={grade.description} />
                          </div>
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
