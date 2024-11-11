import './main.css';
import { Sidebar } from './inherit/sidebar';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

export const Main = (props) => {
    return (
        <>
            <Sidebar />
            <section className='dash-area'>
                <Container className='overflow-hidden' dir='rtl'>
                    <Outlet data_theme={props.data_theme} />
                </Container>
            </section>
        </>
    )
}