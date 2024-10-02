
import './App.css';
import Nav from './Components/Nav';
import Head from './Components/Head';
import DDE from './Components/DDE';
import Table2 from './Components/Table2';
import Table1 from './Components/Table1';
import SystemSelection from './Components/SystemSelection';
import Molecule from './Components/Molecule';

function App(props) {
  return (
    <div className="body">
      {/* NAV BAR */}
      <div> 
          <Nav />
          <Head />
      </div>
      {/* DIV que envolve a seleção de sistema, componente e tabela 1 */}
      
      <div className='container-first'>
        <div className="background-selection">
          <SystemSelection />          
        </div>
        <div className="background-molecule">
          <Molecule />
        </div>
        <div className="table-1">
          <Table1 />
        </div>
        </div>
    
      {/* DIV que envolve o DDE e tabela 2 */}
    <div className='container-second'>
        <div className='dde'>
            <DDE />
        </div>
        <div className='table-2'>
        <Table2 />
        </div>
    </div>
    </div>
  );
}

export default App;
