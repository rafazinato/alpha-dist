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
            <Link to="/"><Button content="Início" /></Link>
            <Button content="Tutorial" />
            <Button content="Teoria" />
            <Link to="/sobre"><Button content="Sobre" /></Link>

            </div>

        </div>



    );
}

export default Nav