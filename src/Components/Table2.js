import React, { useState } from "react";
import "../assets/table2.css";

function Table2({ compound, alfascharge, chosenconc, setChosenConc }) {
  const [chosenph, setChosenPh] = useState();
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
  let wat = 10 ** -chosenph - 10 ** (chosenph - pKw);
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
  for (let i = 0; i < alpha.length; i++) {
    qquad += alpha[i] * each_charge[i] ** 2;
  }
  // Van Slyke’s buffer
  function calcBuffer(chosenph, pka, chosenconc) {
    let ph_before = chosenph - 0.1;
    let wat_before = 10 ** -ph_before - 10 ** (ph_before - pKw);
    let alpha_before = calcAlpha(ph_before, pka);
    let each_charge_before = alfascharge.map(
      (charge, index) => Number(charge) * Number(alpha_before[index])
    );
    let effective_charge_before = 0;

    // calculate effective_charge_before  using forEach() method
    each_charge_before.forEach((num) => {
      effective_charge_before += num;
    });
    buffer =
      ((effective_charge - effective_charge_before) * chosenconc +
        (wat - wat_before)) /
      (chosenph - ph_before);
    // Calculo do buffer sem considerar QWAT
    // buffer = Math.abs(((effective_charge - effective_charge_before)*chosenconc )/(chosenph - ph_before))

    return buffer;
  }

  let buffer = 0;
  buffer = calcBuffer(chosenph, pka, chosenconc);

  // Kolthoff’s buffer capacity
  let koltoff_alpha = calcAlpha(chosenph - 1, pka);

  let each_charge_koltoff = koltoff_alpha.map(
    (charge, index) => Number(charge) * Number(koltoff_alpha[index])
  );
  let effective_charge_koltoff = 0;

  each_charge_koltoff.forEach((num) => {
    effective_charge_koltoff += num;
  });

  let koltoff =
    wat +
    effective_charge * chosenconc -
    10 **
      (-(chosenph - 1) -
        10 ** (chosenph - 1 - pKw) +
        effective_charge_koltoff * chosenconc);
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
          <td>{Number(alpha[0]) ? alpha[0].toFixed(4) : "--"}</td>
        </tr>

        <tr>
          <td>
            α<sub>1</sub>
          </td>
          <td>{Number(alpha[1]) ? alpha[1].toFixed(4) : "--"}</td>
          <td>
            {Math.log10(Number(alpha[1]))
              ? Math.log10(Number(alpha[1])).toFixed(4)
              : "--"}
          </td>
        </tr>
        <tr>
          <td>
            α<sub>2</sub>
          </td>
          <td>{Number(alpha[2]) ? alpha[2].toFixed(4) : "--"}</td>
          <td>
            {Math.log10(Number(alpha[2]))
              ? Math.log10(Number(alpha[2])).toFixed(4)
              : "--"}
          </td>
        </tr>
        <tr>
          <td>
            α<sub>3</sub>
          </td>
          <td>{Number(alpha[3]) ? alpha[3].toFixed(4) : "--"}</td>
          <td>
            {Math.log10(Number(alpha[3]))
              ? Math.log10(Number(alpha[3])).toFixed(4)
              : "--"}
          </td>
        </tr>
        <tr>
          <td>
            α<sub>4</sub>
          </td>
        </tr>
        <tr>
          <td>
            α<sub>5</sub>
          </td>
          <td></td>
          <td></td>


        </tr>
        <tr>
          <td>
            α<sub>6</sub>
          </td>
          <td></td>
          <td></td>


        </tr>
        <tr>
          <td>
            α<sub>7</sub>
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>
            α<sub>8</sub>
          </td>
          <td></td>
          <td></td>
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
            {wat + chosenconc * effective_charge
              ? (wat + chosenconc * effective_charge).toFixed(4)
              : "--"}
          </td>
      </tr>
      <tr>
        {" "}
        <td className="tooltip-container">
          BC<span className="tooltiptext">Kolthoff’s buffer value</span>
        </td>
        <td>{koltoff ? koltoff.toExponential(4) : "--"}</td>
      </tr>
      <tr>
      <td className="tooltip-container">
            β<span className="tooltiptext">Van Slyke’s buffer value</span>
          </td>
          <td>{buffer ? buffer.toFixed(4) : "--"}</td>
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
          <td>{qquad ? qquad.toFixed(4) : "--"}</td>
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
          <td>{effective_charge ? effective_charge.toFixed(4) : "--"}</td>
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
                    onChange={(e) => setChosenPh(e.target.value.replace(",", "."))}
                    id="ph-input"
                ></input>
                </p>
                <p>
          Concentração (mol/L):{" "}
          <input
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
