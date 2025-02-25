import '../header/header.css';
import LogoDark from '../../assets/images/logos/logo_dark.png';
import LogoWhite  from '../../assets/images/logos/logo_white.png';
import useLocalStorage from "use-local-storage";
import { Link } from 'react-router-dom';

export default function Logo(){
    const [storage] = useLocalStorage('isDark');
    return(
        <Link to='/' className='logo d-flex align-items-center'>
            <img width={120} src={storage ? LogoDark:LogoWhite} alt='logo' />
        </Link>
    )
}