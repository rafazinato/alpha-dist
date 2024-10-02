import '../assets/nav.css';

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
            <Button content="Início" />
            <Button content="Tutorial" />
            <Button content="Teoria" />
            <Button content="Sobre" />
            </div>

        </div>



    );
}

export default Nav