import '../header/header.css';
import LogoImg from '../../assets/images/logo.svg';
import LogoImgDark from '../../assets/images/logo1.svg';
import useLocalStorage from "use-local-storage";
import { Link } from 'react-router-dom';

export default function Logo(){
    const [storage] = useLocalStorage('isDark');
    return(
        <Link to='/' className='logo d-flex align-items-center'>
            <img width={170} src={storage ? LogoImgDark:LogoImg} alt='logo' />
        </Link>
    )
}