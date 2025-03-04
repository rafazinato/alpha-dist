import { VscNoNewline } from 'react-icons/vsc';
import '../assets/nav.css';
import { Link } from "react-router-dom";

function Button(props) {
    return(
        <button className='navButton'>{props.content}</button>
    );
}

function Nav(props) {
    return (

        <div className='nav-container'>
            <div className='logo-container'>
            <p className='logo'>AlphaDist</p><p className='logo1'>Web</p>   
            </div>
            <div className='nav'>
            <Link style={{textDecoration: 'none' }} to="/"><Button content="Início" /></Link>
            <Link style={{textDecoration: 'none' }} to="/tutorial"><Button content="Tutorial" /></Link>
            <Button style={{textDecoration: 'none' }} content="Teoria" />
            <Link style={{textDecoration: 'none' }} to="/sobre"><Button content="Sobre" /></Link>

            </div>

        </div>



    );
}

export default Nav