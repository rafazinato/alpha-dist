import '../assets/footer.css'
import logoUfv from '../assets/logoufv.png';




function Footer(props) {
    return (
        <div>
        <div className='foot-container'>
            <div className='logo-container'>
            <p className='logo'>AlphaDist</p><p className='logo1'>Web</p>   
            </div>
        <div className='info-foot'>
        <p className='text-footer'>Site desenvolvido para caracterizar sistemas ácido-base de Bronsted com base no método XXI</p>

        <a href='https://www.solucaoquimica.com/'>solucaoquimica.com</a>
        <img src={logoUfv} alt="" height={50} width={50} />

        </div>

        </div>

        </div>



    );
}

export default Footer