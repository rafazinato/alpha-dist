import "../assets/systemselection.css"
import 'material-symbols'
import Form from 'react-bootstrap/Form';


function SystemSelection() {
    return (
        <div className="grid">
            <div className="grid-item-1">
            Seleção de sistema:
            </div>
            <div className="grid-item-2">
            <Form.Select aria-label="Default select example" id='select-menu'>
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            
            </Form.Select>
            </div>
            <div className="grid-item-3">
                Descrição
            </div>
            <div className="grid-item-4">
                Seleção de base de dados:
            </div>
            <div className="grid-item-5">
            <Form.Select aria-label="Default select example" id='select-menu'>
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            
            </Form.Select>
            </div>
            <div className="grid-item-6">
                Descrição
            </div>
        </div>
        
    );
}

export default SystemSelection