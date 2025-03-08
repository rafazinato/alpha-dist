import "../assets/table1.css";
import { useState, useRef } from "react";
function Table1({
  compound,
  setCompound,
  pkauser,
  setPkaUser,
  showInput,
  setShowInput,
  userchartInstanceRef,
  max_charge_user,
  setMaxChargeUser,
}) {
  compound.charge_protonated = Number(compound.charge_protonated);
  // const [showInput, setShowInput] = useState(false);
  // const [pkauser, setPkaUser] = useState([
  //   Number(compound.pka1),
  //   Number(compound.pka2),
  //   Number(compound.pka3),
  //   Number(compound.pka4),
  //   Number(compound.pka5),
  //   Number(compound.pka6),
  //   Number(compound.pka7),
  //   Number(compound.pka8),
  // ]);

  // state que vai conter texto do botão que decide o tipo de operação
  const[inputvalue, setInputValue] = useState([null,null,null,null,null,null,null,null])
  const [textbutton, setTextButton] = useState('Inserir dados originais')
  const updatePka = (index, newValue) => {
    setPkaUser((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = newValue;
      return newItems;
    });
  };

  function inputfunc(index) {
    return (
      <>
        <input
          id="id-input"
          type="number"
          className="table-input"
          onChange={(e) => updatePka(index, Number(e.target.value))}
        ></input>
      </>
    );
  }

  function inputfunc_charge_user() {
    return (
      <>
        <input
          id="id-input-user"
          type="number"
          className="table-input"
          onChange={(e) => setMaxChargeUser(Number(e.target.value))}
        ></input>
      </>
    );
  }


  
  function handlebutton() {
    resetuserData()
    showInput ?  setTextButton('Inserir dados originais'): setTextButton('Voltar à base de dados')
    !showInput ?  setShowInput(true) : setShowInput(false)
    showInput ?  setShowInput(false) : setShowInput(true)
  }
  function resetuserData() {
    if (userchartInstanceRef.current) {
      userchartInstanceRef.current.destroy();
    }
    setPkaUser([]);
    setShowInput(false);

  
  }
  function resetinput() {
    if (userchartInstanceRef.current) {
      userchartInstanceRef.current.destroy();
    }
    setPkaUser([]);
    setInputValue([null, null, null, null, null, null, null, null]);
    const inputs = document.querySelectorAll('.table-input');
    inputs.forEach((input) => (input.value = '')); // Limpa os valores dos inputs 
  }
  function maketable() {
    let listpka = [compound.pka1, compound.pka2, compound.pka3];
    let numberpka = listpka.filter((v) => v).length;
    let alfascharge = [compound.charge_protonated];
    for (let i = 0; i < numberpka; i++) {
      alfascharge.push(alfascharge[alfascharge.length - 1] - 1);
    }

    listpka = listpka.map((i) => (i == "" ? "--" : i));
    let indexOfMax = alfascharge
      .map(Math.abs)
      .indexOf(Math.max(...alfascharge.map(Math.abs)));
    let maxcharge = alfascharge[indexOfMax];
    listpka.unshift(maxcharge);
    
    return (
      <div style={{ display: "flex", gap: "10px" }}>

        <table className="charge-table">
          <thead className="table1-header">
            <tr>
              <th>{showInput ? 'Carga da espécie mais protonada' : "Carga máxima" }</th>
            </tr>
          </thead>
          <tr>
            <td>
            {showInput
                  ? inputfunc_charge_user()
                  : maxcharge
                  ? maxcharge
                  : "--"}
              
              </td>
          </tr>
        </table>
        <table className="table1">
          <thead className="table1-header">
            <tr>
              {/* <th rowSpan={2}>Carga máxima</th> */}
              <th>
                pKA<sub>1</sub>
              </th>
              <th>
                pKA<sub>2</sub>
              </th>
              <th>
                pKA<sub>3</sub>
              </th>
              <th>
                pKA<sub>4</sub>
              </th>
            </tr>
            <tr>
              <td className="cell">
                {showInput
                  ? inputfunc(0)
                  : compound.pka1
                  ? compound.pka1
                  : "--"}
              </td>
              <td className="cell">
                {showInput
                  ? inputfunc(1)
                  : compound.pka2
                  ? compound.pka2
                  : "--"}
              </td>
              <td className="cell">
                {showInput
                  ? inputfunc(2)
                  : compound.pka3
                  ? compound.pka3
                  : "--"}
              </td>
              <td className="cell">
                {showInput
                  ? inputfunc(3)
                  : compound.pka4
                  ? compound.pka4
                  : "--"}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* <td rowSpan={2}>{maxcharge}</td> */}
              <th className="cell2">
                pKA<sub>5</sub>
              </th>
              <th className="cell2">
                pKA<sub>6</sub>
              </th>
              <th className="cell2">
                pKA<sub>7</sub>
              </th>
              <th className="cell2">
                pKA<sub>8</sub>
              </th>
            </tr>
            <tr>
            <td className="cell">
                {showInput
                  ? inputfunc(4)
                  : compound.pka5
                  ? compound.pka5
                  : "--"}
              </td>
              <td className="cell">
                {showInput
                  ? inputfunc(5)
                  : compound.pka6
                  ? compound.pka6
                  : "--"}
              </td>
              <td className="cell">
                {showInput
                  ? inputfunc(6)
                  : compound.pka7
                  ? compound.pka7
                  : "--"}
              </td>
              <td className="cell">
                {showInput
                  ? inputfunc(7)
                  : compound.pka8
                  ? compound.pka8
                  : "--"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return <>


      {maketable()}

  <div style={{display:'flex', justifyContent: 'center', gap:'10px', marginTop: '10px' }}>
  <button  className='button-style' onClick={() => handlebutton()}>{textbutton}</button>
  {showInput ? <button className='button-style' onClick={() => resetinput()}>Resetar Dados</button> : <></>}
  </div>
  </>;
}

export default Table1;
