import React, { useState,useEffect } from "react";
import "../assets/table2.css";

function Table2({ compound, alfascharge, chosenconc, setChosenConc,alfascharge_user,pkauser,showInput }) {
  const [chosenph, setChosenPh] = useState(3);
  const pka = [
    Number(compound.pka1),
    Number(compound.pka2),
    Number(compound.pka3),
    Number(compound.pka4),
    Number(compound.pka5),
    Number(compound.pka6),
    Number(compound.pka7),
    Number(compound.pka8)
  ].filter((v) => v !== 0);

  // Função que retorna uma lista, em que cada elemento corresponde ao alfa0,alfa1....alfaN
  function calcAlpha(ph, pka) {
    let alpha = [];

    let denominator = 1;
    pka.forEach((element, idx) => {
      denominator += element
        ? 10 **
          ((idx + 1) * ph -
            pka.slice(0, idx + 1).reduce((acc, curr) => acc + curr, 0))
        : 0;
    });

    // alpha 0
    alpha.push(1 / denominator);

    // other alphas
    pka.forEach((element, idx) => {
      if (element)
        alpha.push(
          alpha[0] *
            10 **
              ((idx + 1) * ph -
                pka.slice(0, idx + 1).reduce((acc, curr) => acc + curr, 0))
        );
    });

    return alpha;
  }

  // calculo do Wat para temperatura ambiente
  let pKw = 14;
  let wat = 10**(-chosenph)  - 10**(chosenph - pKw);
  let alpha = calcAlpha(chosenph, pka);
  let qwat = (10 ** -chosenph) ** 2 + (10 ** (chosenph - pKw)) ** 2;

  let each_charge = alfascharge.map(
    (charge, index) => Number(charge) * Number(alpha[index])
  );
  let effective_charge = 0;

  // calculate effective charge using forEach() method
  each_charge.forEach((num) => {
    effective_charge += num;
  });
  let qquad = 0;
  // for (let i = 0; i < alpha.length; i++) {
  //   qquad += alpha[i] * each_charge[i] ** 2;
  // }
  qquad = alpha.map((e,idx) => (e*((alfascharge[idx]))**2))
  qquad = qquad.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  // Van Slyke’s buffer

    let ph_before = Number(chosenph - 0.1);
    let wat_before = 10 **(-ph_before) - 10 ** (ph_before - pKw);
    let alpha_before = calcAlpha(ph_before, pka);
    let each_charge_before = alfascharge.map(
      (charge, index) => Number(charge) * Number(alpha_before[index])
    );
    let effective_charge_before = 0;

    // calculate effective_charge_before  using forEach() method
    each_charge_before.forEach((num) => {
      effective_charge_before += num;
    });


    let buffer = 0

    buffer =((effective_charge - effective_charge_before) * chosenconc +
        (wat - wat_before)) /
      (Number(chosenph) - ph_before);

    // Calculo do buffer sem considerar QWAT
    // buffer = Math.abs(((effective_charge - effective_charge_before)*chosenconc )/(chosenph - ph_before))
    


  
  // let buffer = calcBuffer(chosenph, pka, chosenconc);
  // console.log(buffer)

  // Kolthoff’s buffer capacity
  let koltoff_alpha = calcAlpha(chosenph - 1, pka);

  let each_charge_koltoff = alfascharge.map(
    (charge, index) => Number(charge) * Number(koltoff_alpha[index])
  );
  let effective_charge_koltoff = 0;

  each_charge_koltoff.forEach((num) => {
    effective_charge_koltoff += num;
  });

  let koltoff =
    effective_charge * chosenconc -
        (effective_charge_koltoff*chosenconc) + (wat - (10**(-(chosenph -1))  - 10 **(chosenph -1 - pKw)));

// Calculando parametros para quando o usuario insere dados
let alpha_user = calcAlpha(chosenph, pkauser);


let each_charge_user = alfascharge_user.map(
  (charge, index) => Number(charge) * Number(alpha_user[index])
);
let effective_charge_user = 0;

// calculate effective charge using forEach() method
each_charge_user.forEach((num) => {
  effective_charge_user += num;
});


function calcBufferUser(chosenph, pkauser, chosenconc) {
  let ph_before = chosenph - 0.1;
  let wat_before = 10 **(-ph_before) - 10 ** (ph_before - pKw);
  let alpha_before_user = calcAlpha(ph_before, pkauser);
  let each_charge_before_user = alfascharge_user.map(
    (charge, index) => Number(charge) * Number(alpha_before_user[index])
  );
  let effective_charge_before_user = 0;

  // calculate effective_charge_before  using forEach() method
  each_charge_before_user.forEach((num) => {
    effective_charge_before_user += num;
  });
  let buffer =
    ((effective_charge_user - effective_charge_before_user) * chosenconc +
      (wat - wat_before)) /
    (chosenph - ph_before);
    return buffer;

}


let buffer_user = calcBufferUser(chosenph, pkauser, chosenconc)

let koltoff_alpha_user = calcAlpha(chosenph - 1, pkauser);

let each_charge_koltoff_user = alfascharge_user.map(
  (charge, index) => Number(charge) * Number(koltoff_alpha_user[index])
);
let effective_charge_koltoff_user = 0;

each_charge_koltoff_user.forEach((num) => {
  effective_charge_koltoff_user += num;
});

let koltoff_user =
  effective_charge_user * chosenconc -
  (10 **
    (-(chosenph - 1)) -
      10 ** (chosenph - 1 - pKw))/(chosenph - 1) +
       - effective_charge_koltoff_user * chosenconc;



  let qquad_user = 0    
  qquad_user = alpha_user.map((e,idx) => (e*((alfascharge_user[idx]))**2))
  qquad_user = qquad_user.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );


  function maketable2() {
    return (
      <table className="table2">
        <thead>
          <th>α</th>
          <th>Valores</th>
          <th>log α</th>
        </thead>
        <tr>
          <td>
            α<sub>0</sub>
          </td>
          <td>{showInput ? alpha_user[0].toFixed(4) : ( Number(alpha[0]) ? alpha[0].toFixed(4) : "--")}</td>

        </tr>

        <tr>
          <td>
            α<sub>1</sub>
          </td>
          <td>{alpha_user[1] ? alpha_user[1].toFixed(4) : ( Number(alpha[1]) ? alpha[1].toFixed(4) : "--")}</td>
          <td>
            {Math.log10(alpha_user[1]) ? Math.log10(alpha_user[1]).toFixed(4) : (Math.log10(Number(alpha[1])) ? Math.log10(Number(alpha[1])).toFixed(4): "--")}
          </td>
        </tr>
        <tr>
          <td>
            α<sub>2</sub>
          </td>
          <td>{alpha_user[2] ? alpha_user[2].toFixed(4) : ( Number(alpha[2]) ? alpha[2].toFixed(4) : "--")}</td>
          <td>
          {Math.log10(alpha_user[2]) ? Math.log10(alpha_user[2]).toFixed(4) : (Math.log10(Number(alpha[2])) ? Math.log10(Number(alpha[2])).toFixed(4): "--")}
          </td>
        </tr>
        <tr>
          <td>
            α<sub>3</sub>
          </td>
          <td>{alpha_user[3] ? alpha_user[3].toFixed(4) : ( Number(alpha[3]) ? alpha[3].toFixed(4) : "--")}</td>
          <td>
          {Math.log10(alpha_user[3]) ? Math.log10(alpha_user[3]).toFixed(4) : (Math.log10(Number(alpha[3])) ? Math.log10(Number(alpha[3])).toFixed(4): "--")}

          </td>
        </tr>
        <tr>
          <td>
            α<sub>4</sub>
          </td>
          <td>{alpha_user[4] ? alpha_user[4].toFixed(4) : ( Number(alpha[4]) ? alpha[4].toFixed(4) : "--")}</td>
          <td>
          {Math.log10(alpha_user[4]) ? Math.log10(alpha_user[4]).toFixed(4) : (Math.log10(Number(alpha[4])) ? Math.log10(Number(alpha[4])).toFixed(4): "--")}

          </td>
        </tr>
        <tr>
          <td>
            α<sub>5</sub>
          </td>
          <td>{alpha_user[5] ? alpha_user[5].toFixed(4) : ( Number(alpha[5]) ? alpha[5].toFixed(4) : "--")}</td>
          <td>
          {Math.log10(alpha_user[5]) ? Math.log10(alpha_user[5]).toFixed(4) : (Math.log10(Number(alpha[5])) ? Math.log10(Number(alpha[5])).toFixed(4): "--")}

          </td>


        </tr>
        <tr>
          <td>
            α<sub>6</sub>
          </td>
          <td>{alpha_user[6] ? alpha_user[6].toFixed(4) : ( Number(alpha[6]) ? alpha[6].toFixed(4) : "--")}</td>
          <td>
          {Math.log10(alpha_user[6]) ? Math.log10(alpha_user[6]).toFixed(4) : (Math.log10(Number(alpha[6])) ? Math.log10(Number(alpha[6])).toFixed(4): "--")}

          </td>


        </tr>
        <tr>
          <td>
            α<sub>7</sub>
          </td>
          <td>{alpha_user[7] ? alpha_user[7].toFixed(4) : ( Number(alpha[7]) ? alpha[7].toFixed(4) : "--")}</td>
          <td>
          {Math.log10(alpha_user[7]) ? Math.log10(alpha_user[7]).toFixed(4) : (Math.log10(Number(alpha[7])) ? Math.log10(Number(alpha[7])).toFixed(4): "--")}

          </td>
        </tr>
        <tr>
          <td>
            α<sub>8</sub>
          </td>
          <td>{alpha_user[8] ? alpha_user[8].toFixed(4) : ( Number(alpha[8]) ? alpha[8].toFixed(4) : "--")}</td>
          <td>
          {Math.log10(alpha_user[8]) ? Math.log10(alpha_user[8]).toFixed(4) : (Math.log10(Number(alpha[8])) ? Math.log10(Number(alpha[8])).toFixed(4): "--")}

          </td>
        </tr>
      </table>
    );
  }

  function maketable3() {

    return(

    
    <table className="table2">
      <thead>
        <th colSpan={2}>Paramêtros de Tampões</th>

      </thead>
      <tr>
      <td className="tooltip-container">
            τ<span className="tooltiptext">Buffering Function</span>
          </td>
          <td>
            {showInput
              ? (wat + chosenconc * effective_charge_user).toFixed(4) : (wat + chosenconc * effective_charge
              ? (wat + chosenconc * effective_charge).toFixed(4)
              : "--")}
          </td>
      </tr>
      <tr>
        {" "}
        <td className="tooltip-container">
          BC<span className="tooltiptext">Kolthoff’s buffer value</span>
        </td>
        <td>{showInput ? koltoff_user.toFixed(4) : (koltoff ? koltoff.toExponential(4) : "--") }</td>
      </tr>
      <tr>
      <td className="tooltip-container">
            β<span className="tooltiptext">Van Slyke’s buffer value</span>
          </td>
          <td>{ showInput ? buffer_user.toFixed(4) : (buffer ? buffer.toExponential(4) : "--")}</td>    
      </tr>
    </table>
    );
  }

  function maketable4() {

    return(

    
    <table className="table2">
      <thead>
        <th colSpan={2}>Variantes com pH</th>

      </thead>
      <tr>
      <td className="tooltip-container">
            q<sub>quad</sub>
            <span className="tooltiptext">Ion contribution</span>
          </td>
          <td>{showInput ? qquad_user.toFixed(4) : (qquad ? qquad.toFixed(4) : "--")}</td>
      </tr>
      <tr>
      <td className="tooltip-container">
            q<sub>wat</sub>
            <span className="tooltiptext">
              Ionic strenght water contribution
            </span>
          </td>
          <td>{qwat ? qwat.toExponential(4) : "--"}</td>
      </tr>
      <tr>
      <td className="tooltip-container">
            q<sub>ef</sub>
            <span className="tooltiptext"> Effective charge</span>
          </td>
          <td>{showInput ? effective_charge_user.toFixed(4) : (effective_charge ? effective_charge.toFixed(4) : "--")}</td>
      </tr>
      <tr>
      <td className="tooltip-container">
            Wat<span className="tooltiptext">Water contribution</span>
          </td>
          <td>{wat ? wat.toExponential(4) : "--"}</td>
      </tr>
    </table>
    );
  }

  
  return (
    <>
    <div style={{display: 'flex',gap:'30px'}}>
    <p>
                pH:{" "}
                <input
                defaultValue={3}
                    onChange={(e) => setChosenPh(e.target.value.replace(",", "."))}
                    id="ph-input"
                ></input>
                </p>
                <p>
          Concentração (mol/L):{" "}
          <input
          defaultValue={1}
            onChange={(e) =>
              setChosenConc(parseFloat(e.target.value.replace(",", ".")) || 0)
            }
            id="c-input"
          ></input>
        </p>    
    </div>

    <div className="tables-container-grid">

        <div className="table-alfas">
        <div className="ph-selection">


            </div>
            {maketable2()}
        </div>
        <div className="tables-charges">
        {maketable4()}
        </div>
      <div className="tables-buffer">

        {maketable3()}
        </div>  


    </div>
    </>
  );
}

export default Table2;
