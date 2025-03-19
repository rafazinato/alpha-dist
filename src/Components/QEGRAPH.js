import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../assets/graphs.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useMemo } from "react";
import GraphComponent from "./GraphComponent";

function arange(start, stop, step = 1) {
  let result = [];
  for (let i = start; i < stop; i += step) {
    result.push(i);
  }
  return result;
}

function QEGRAPH({
  compound,
  alfascharge,
  alfascharge_user,
  pkauser,
  showInput,
}) {

  // Variavéis usadas para construção do gráfico principal

  const pka = [
    Number(compound.pka1),
    Number(compound.pka2),
    Number(compound.pka3),
    Number(compound.pka4),
    Number(compound.pka5),
    Number(compound.pka6),
    Number(compound.pka7),
    Number(compound.pka8),
  ].filter((v) => v !== 0);

  const [ph, setPh] = useState(
    arange(0, 14.05, 0.05).map((value) => parseFloat(value.toFixed(4)))
  );

  // Função que retorna uma lista, em qu cada elemento corresponde ao alfa0,alfa1....alfaN
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

  // Atribuindo cada elemento de alfa a uma variavel
  let alpha = ph.map((ph) => calcAlpha(ph, pka));
  let a0 = alpha.map((a) => a[0]);
  let a1 = alpha.map((a) => a[1]);
  let a2 = alpha.map((a) => a[2]);
  let a3 = alpha.map((a) => a[3]);
  let a4 = alpha.map((a) => a[4]);
  let a5 = alpha.map((a) => a[5]);
  let a6 = alpha.map((a) => a[6]);
  let a7 = alpha.map((a) => a[7]);
  let a8 = alpha.map((a) => a[8]);

  // Criando o cálculo da carga efetiva
  let alpha_list = [a0, a1, a2, a3, a4, a5, a6, a7, a8];
  let each_charge = ph.map((ph, phindex) =>
    alfascharge.map(
      (charge, index) => Number(charge) * Number(alpha_list[index][phindex])
    )
  );

  let alpha_user = ph.map((ph) => calcAlpha(ph, pkauser));
  let a0_user = alpha_user.map((a) => a[0]);
  let a1_user = alpha_user.map((a) => a[1]);
  let a2_user = alpha_user.map((a) => a[2]);
  let a3_user = alpha_user.map((a) => a[3]);
  let a4_user = alpha_user.map((a) => a[4]);
  let a5_user = alpha_user.map((a) => a[5]);
  let a6_user = alpha_user.map((a) => a[6]);
  let a7_user = alpha_user.map((a) => a[7]);
  let a8_user = alpha_user.map((a) => a[8]);
  let alpha_list_user = [
    a0_user,
    a1_user,
    a2_user,
    a3_user,
    a4_user,
    a5_user,
    a6_user,
    a7_user,
    a8_user,
  ];
  let each_charge_user = ph.map((ph, phindex) =>
    alfascharge_user.map(
      (charge, index) =>
        Number(charge) * Number(alpha_list_user[index][phindex])
    )
  );

  // let effective_charge = [];
  // let effective_charge_reference = [];

  // each_charge.forEach((num) => {
  //   effective_charge.push(num.reduce((acc, curr) => acc + curr, 0));
  //   // effective_charge_reference.push(num.reduce((acc, curr) => acc + curr, 0));
  // });

  let effective_charge = useMemo(() => {
    const tempReference = [];
    each_charge.forEach((num) => {
      tempReference.push(num.reduce((acc, curr) => acc + curr, 0));
    });
    return tempReference;
  }, [each_charge]);

  let effective_charge_user = useMemo(() => {
    const tempReference = [];
    each_charge_user.forEach((num) => {
      tempReference.push(num.reduce((acc, curr) => acc + curr, 0));
    });
    return tempReference;
  }, [each_charge_user]);


  let y_data = [
    {
      label: "Carga Efetiva",
      data: effective_charge,
      backgroundColor: "rgba(3, 119, 252, 0.2)",
      borderColor: "rgba(3, 119, 252, 1)",
      borderWidth: 2,
      fill: false,
    },
  ];

  let y_data_user = [
    {
      label: "Carga Efetiva",
      data: effective_charge_user,
      backgroundColor: "rgba(3, 119, 252, 0.2)",
      borderColor: "rgba(3, 119, 252, 1)",
      borderWidth: 2,
      fill: false,
    },
  ];
  let indexOfMax = alfascharge
    .indexOf(Math.max(...alfascharge));
  let indexOfMin = alfascharge
    .indexOf(Math.min(...alfascharge));
  let max_y = alfascharge[indexOfMax];
  let min_y = alfascharge[indexOfMin];

  let max_y_user =
    alfascharge_user[
      alfascharge_user
        .indexOf(Math.max(...alfascharge_user))
    ];

  let min_y_user =
    alfascharge_user[
      alfascharge_user
        .indexOf(Math.min(...alfascharge_user))
    ];

  return (
    <div>
      <div className="graph-container">
        {/* <canvas ref={chartRef} /> */}

        {showInput ? (
          <GraphComponent
            x_data={ph}
            y_data={y_data_user}
            y_title={"Effective Charge (qe)"}
            initial_limits={[0, 14, min_y_user, max_y_user]}
            graph_title={"Carga Efetiva"}
          />
        ) : (
          <GraphComponent
            x_data={ph}
            y_data={y_data}
            y_title={"Effective Charge (qe)"}
            initial_limits={[0, 14, min_y, max_y]}
            graph_title={"Carga Efetiva"}
          />
        )}
      </div>
    </div>
  );
}

export default QEGRAPH;
