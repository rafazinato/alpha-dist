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
                <p className='logo'>AlphaDist</p>
                <p className='logo1'>Web</p>   
            </div>
            <nav className='nav'>
                <Link style={{textDecoration: 'none'}} to="/">
                    <Button content="Início" />
                </Link>
                <Link style={{textDecoration: 'none'}} to="/tutorial">
                    <Button content="Tutorial" />
                </Link>
                <Link style={{textDecoration: 'none'}} to="/teoria">
                    <Button content="Teoria" />
                </Link>
                <Link style={{textDecoration: 'none'}} to="/sobre">
                    <Button content="Sobre" />
                </Link>
            </nav>
        </div>
        
        
    );
}

export default Nav;