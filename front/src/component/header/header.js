import './header.css';
import '../../App.css';
import ModeBtn from '../inherit/mode-btn';
import { Container } from 'react-bootstrap';
import Logo from '../inherit/Logo';
import RedMainBtn from '../inherit/MainBtn';
import { motion, useScroll, useSpring } from "framer-motion";
import { Link } from 'react-router-dom';
import IsLoggedIn from '../user/isLoggedIn/IsLoggedIn';
import { useEffect, useRef } from 'react';


function Header({ isChecked, handelMode, dataAuth, data_theme }) {
  const { scrollYProgress } = useScroll();
  const headerRef = useRef();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 1000,
    damping: 15,
    restDelta: 0.001
  });
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      document.querySelector('.navbar').classList.add('scrollable');
    } else {
      document.querySelector('.navbar').classList.remove('scrollable');
    }
  });


  // disable context menu
  useEffect(() => {
    if (headerRef.current !== undefined) {
      headerRef.current.addEventListener('contextmenu', event => event.preventDefault())
    }
  }, [headerRef]);


  // 

  const navLinksAction = () => {
    const nav_links_sm = document.getElementById('nav-links');
    const moreBtn = document.getElementById('more');
    nav_links_sm.classList.toggle('active');
    moreBtn.classList.toggle('active');
  }
  const home_icon = <svg xmlns="http://www.w3.org/2000/svg" className='mb-1' viewBox="0 0 576 512"><path fill='#fff' d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" /></svg>
  return (
    <nav ref={headerRef} className="navbar" id={(dataAuth.isAuthenticated === true) ? 'switch' : 'not_auth'}>
      <Container className='d-flex container overflow-visible'>
        <div className='nav-main d-flex gap-3 justify-content-center align-items-center'>
          {
            (dataAuth.isAuthenticated !== true) ?
              <button id='more' className='more' onClick={navLinksAction}>
                <div>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button> : <IsLoggedIn data_theme={data_theme} className='isLoggedInSM' dataUser={dataAuth} />
          }
          <Logo />
          <ModeBtn isChecked={isChecked} handelMode={handelMode} />
        </div>

        {
          (dataAuth.isAuthenticated !== true) ?
            <>
              <div id='nav-links' className='nav-links d-flex gap-3'>
                <Link onClick={navLinksAction} to='/login' className='login d-flex gap-1 justify-content-center align-items-center' dir='rtl'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill='var(--red-light)' d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" /></svg>
                  <span style={{ 'color': 'var(--color-default2)' }}>تسجيل </span>
                  <span style={{ 'color': 'var(--red-light)' }}>الدخول</span>
                </Link>
                <RedMainBtn onClick={navLinksAction} to='/register' name='انشاء حساب' id='register' icon={home_icon} />
              </div>
            </>
            : <IsLoggedIn data_theme={data_theme} className='isLoggedInLG' dataUser={dataAuth} />
        }


      </Container>
      <motion.div
        className="tape"
        style={{ scaleX }}
      />
    </nav>
  );
}
export default Header;


