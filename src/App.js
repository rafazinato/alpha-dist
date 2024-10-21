
import './App.css';
import Nav from './Components/Nav';
import Head from './Components/Head';
import DDE from './Components/DDE';
import Table2 from './Components/Table2';
import Table1 from './Components/Table1';
import SystemSelection from './Components/SystemSelection';
import Molecule from './Components/Molecule';
import { useState, useEffect } from 'react';
import * as Papa from "papaparse";
import data1 from "./data/Pasta1.csv";

function App() {

  const [data, setData] = useState([]); // Estado para armazenar os dados do arquivo
   const [selectedDataset, setSelectedDataset] = useState('');
   const [compound, setCompound] = useState({
     name: '',
     smiles: '',
     pka1: '',
     pka2: '',
     pka3: '',
     charge_protonated: ''
   });

   // Calculando a carga de cada alfa para calculo de carga máxima e carga efetiva
   let listpka = [compound.pka1, compound.pka2, compound.pka3];
   let numberpka = listpka.filter((v) => v).length;
   let alfascharge = [compound.charge_protonated];
   for (let i = 0; i < numberpka; i++) {
     alfascharge.push(alfascharge[alfascharge.length - 1] - 1);
   }


  useEffect(() => {
    const fetchParseData = async () => {
      Papa.parse(data1, {
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
  }, []); // Chama o efeito apenas uma vez quando o componente monta
  console.log(compound.charge_protonated)
  return (
    <div className="body">
      {/* NAV BAR */}
      <div> 
          <Nav />
          <Head />
      </div>
      {/* DIV que envolve a seleção de sistema, componente e tabela 1 */}
      
      <div className='container-first'>
          <SystemSelection data={data} setCompound={setCompound} />          
        <div className="background-molecule">
          <Molecule smiles={compound.smiles}/>
        </div>
        <div className="table-1">
          <Table1 compound={compound} />
        </div>
        </div>
    
      {/* DIV que envolve o DDE e tabela 2 */}
    <div className='container-second'>
        <div className='table-2'>
          <Table2 compound={compound} alfascharge={alfascharge} />
        </div>
        <div className='dde'>

        <DDE compound={compound} />

        </div>
    </div>
    <a href='https://google.com'>asaaa</a>
    </div>
  );
}

export default App;
