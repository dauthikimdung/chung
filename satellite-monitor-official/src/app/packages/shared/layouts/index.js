import './index.css';
import Header from './Header/Header';

const Layouts = ({ children }) => {
    return (
        <>
            <div className='layout'>
                <Header />
                <div className='main'>
                    {/* <Sidebar /> */}
                    <div className='content'>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Layouts;
