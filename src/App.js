
import './App.css';
import Nav from './Components/Nav';
import Head from './Components/Head';
import DDE from './Components/DDE';
import LOGDDE from './Components/LOGDDE';
import Table2 from './Components/Table2';
import Table1 from './Components/Table1';
import SystemSelection from './Components/SystemSelection';
import Molecule from './Components/Molecule';
import { useState, useEffect } from 'react';
import * as Papa from "papaparse";
import file1 from "./data/Database1.csv";
import file2 from "./data/Database2.csv";
import { parse } from 'smiles-drawer';
import QEGRAPH from './Components/QEGRAPH';
import VANSYKLE from './Components/VANSYKLE.js';
import BUFFERFUNCTION from './Components/BufferingFunction.js';
import Footer from './Components/Footer.js';
function App() {

  const [data, setData] = useState([]); // Estado para armazenar os dados do arquivo
   const [selectedDataset, setSelectedDataset] = useState(file1);
   const [compound, setCompound] = useState({
     name: '',
     smiles: '',
     pka1: '',
     pka2: '',
     pka3: '',
     charge_protonated: ''
   });
   const [chosenconc, setChosenConc] = useState(0) 

   // Calculando a carga de cada alfa para calculo de carga máxima e carga efetiva
   let listpka = [compound.pka1, compound.pka2, compound.pka3];
   let numberpka = listpka.filter((v) => v).length;
   let alfascharge = [compound.charge_protonated];
   for (let i = 0; i < numberpka; i++) {
     alfascharge.push(alfascharge[alfascharge.length - 1] - 1);
   }

   const datasets = {
    "Dataset 1": file1,
    "Dataset 2": file2,
   };

  useEffect(() => {
    const fetchParseData = async () => {
      Papa.parse(selectedDataset, {
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
  }, [selectedDataset]); // Chama o efeito apenas uma vez quando o componente monta

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
            <SystemSelection data={data} setCompound={setCompound} datasets={datasets} selectedDataset={selectedDataset} setSelectedDataset={setSelectedDataset} />   
          </div>

          <div className="background-molecule">
            <Molecule smiles={compound.smiles}/>
          </div>
          <div className="table-1">
            <Table1 compound={compound} />
          </div>
          <div className='table-2'>
          <Table2 compound={compound} alfascharge={alfascharge}  chosenconc={chosenconc} setChosenConc={setChosenConc} />
          </div>
          <div className='dde'>
              <DDE compound={compound} />
          </div>
          <div className='ddelog'>
              <LOGDDE compound={compound} />
          </div>
          <div>
            <QEGRAPH compound={compound} alfascharge={alfascharge} />
          </div>
          <div>
            <VANSYKLE compound={compound} alfascharge={alfascharge} chosenconc={chosenconc} />
          </div>
          <div>
          <BUFFERFUNCTION compound={compound} alfascharge={alfascharge} chosenconc={chosenconc} />
          </div>
      </div>
      <Footer />
      </div>


  );
}

export default App;
