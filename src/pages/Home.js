
import '../assets/homepage.css'
import Nav from '../Components/Nav.js';
import Head from '../Components/Head';
import DDE from '../Components/DDE';
import LOGDDE from '../Components/LOGDDE';
import Table2 from '../Components/Table2';
import Table1 from '../Components/Table1';
import SystemSelection from '../Components/SystemSelection';
import Molecule from '../Components/Molecule';
import { useState, useEffect, useRef } from 'react';
import * as Papa from "papaparse";
import file from "../data/Database.csv";
import QEGRAPH from '../Components/QEGRAPH';
import VANSYKLE from '../Components/VANSYKLE.js';
import IONICSTRENGTH from '../Components/IONICSTRENGTH.js';
import Footer from '../Components/Footer.js';



function Home() {
    const [needupdate, setNeedUpdate] = useState(false)

    const [data, setData] = useState([]); 
    //  const [selectedDataset, setSelectedDataset] = useState(file);
    const selectedDataset = file
     const [compound, setCompound] = useState({
       categoria: '',
       name: '',
       charge_protonated: '',
       pka1: '',
       pka2: '',
       pka3: '',
       pka4: '',
       pka5: '',
       pka6: '',
       pka7: '',
       pka8: '',
       smiles: '',
       referencia: '',
       
     });
     const [chosenconc, setChosenConc] = useState(0) 
     // State que controla user gráfico
     const userchartInstanceRef = useRef(null);
     // Calculando a carga de cada alfa
     let listpka = [compound.pka1, compound.pka2, compound.pka3, compound.pka4,compound.pka5,compound.pka6,compound.pka7,compound.pka8];
     let numberpka = listpka.filter((v) => v).length;
     let alfascharge = [compound.charge_protonated];
     for (let i = 0; i < numberpka; i++) {
       alfascharge.push(alfascharge[alfascharge.length - 1] - 1);
     }
     // State que vai conter os pkas inseridos pelo usuario
     const [showInput, setShowInput] = useState(false);
     const [pkauser, setPkaUser] = useState([]);
     const datasets = {
       'Dataset' : file,
     };

    useEffect(() => {
      const fetchParseData = async () => {
        Papa.parse(file, {
          download: true,
          delimiter: ",",
          header: true,
          complete: (result) => {
            const parsedData = result.data;
            setData(parsedData); // Armazena os dados no estado
          },
        });
      };
  
      fetchParseData();
    }, [selectedDataset]);
    return (
      <div className="body">
        {/* NAV BAR */}
        <div> 
            <Nav />
            <Head />
        </div>
        {/* DIV que envolve a seleção de sistema, componente e tabela 1 */}
        
        <div className='container-first'>
            <div className='grid-system-selection'>
              <SystemSelection data={data} setCompound={setCompound} datasets={datasets} selectedDataset={selectedDataset} needupdate={needupdate} setNeedUpdate={setNeedUpdate} />   
            </div>
  
            <div className="background-molecule">
              <Molecule smiles={compound.smiles}/>
            </div>
            <div className="table-1">
              <Table1 compound={compound} setCompound={setCompound} pkauser={pkauser} setPkaUser={setPkaUser}  showInput={showInput} setShowInput={setShowInput} userchartInstanceRef={userchartInstanceRef}/>
            </div>
            <div >
            <QEGRAPH compound={compound} alfascharge={alfascharge} />
            </div>
            <div className='dde'>
                <DDE compound={compound} pkauser={pkauser} showInput={showInput} userchartInstanceRef={userchartInstanceRef} />
            </div>
            <div className='ddelog'>
                <LOGDDE compound={compound} />
            </div>
            <div className='table-2'>

              <Table2 compound={compound} alfascharge={alfascharge}  chosenconc={chosenconc} setChosenConc={setChosenConc} />
            </div>
            <div>
              <VANSYKLE compound={compound} alfascharge={alfascharge} chosenconc={chosenconc} needupdate={needupdate} setNeedUpdate={setNeedUpdate} />
            </div>
            <div>
            <IONICSTRENGTH compound={compound} alfascharge={alfascharge} chosenconc={chosenconc} />
            </div>
        </div>
        <Footer />
        </div>
  
  
    );
  }
  
  export default Home;