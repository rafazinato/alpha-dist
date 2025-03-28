import React, { useState, useEffect, useRef } from "react";
import "../assets/graphs.css";
import GraphComponent from "./GraphComponent";

function arange(start, stop, step = 1) {
  let result = [];
  for (let i = start; i < stop; i += step) {
    result.push(i);
  }
  return result;
}

function DDE({ compound, pkauser, showInput}) {
 
  // const userchartInstanceRef = useRef(null);
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


  // Função que retorna uma lista, em que cada elemento corresponde ao alfa0,alfa1....alfaN
  function calcAlpha(ph, pka) {
    pka = pka.filter((v) => v !== 0);
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

  // Variaveis para inserir dados do usuario

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

  let y_data = [
    {
      label: "α0",
      data: a0,
      backgroundColor: "rgba(3, 119, 252, 0.2)",
      borderColor: "rgba(3, 119, 252, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α1",
      data: a1,
      backgroundColor: "rgba(252, 177, 3, 0.2)",
      borderColor: "rgba(252, 177, 3, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α2",
      data: a2,
      backgroundColor: "rgba(11, 158, 45, 0.2)",
      borderColor: "rgba(11, 158, 45, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α3",
      data: a3,
      backgroundColor: "rgba(219, 18, 18, 0.2)",
      borderColor: "rgba(219, 18, 18, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α4",
      data: a4,
      backgroundColor: "rgba(18, 206, 219, 0.2)",
      borderColor: "rgb(18, 212, 219)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α5",
      data: a5,
      backgroundColor: "rgba(162, 18, 219, 0.2)",
      borderColor: "rgb(179, 18, 219)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α6",
      data: a6,
      backgroundColor: "rgba(108, 219, 18, 0.2)",
      borderColor: "rgb(98, 219, 18)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α7",
      data: a7,
      backgroundColor: "rgba(219, 18, 112, 0.2)",
      borderColor: "rgb(219, 18, 169)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α8",
      data: a8,
      backgroundColor: "rgba(18, 31, 219, 0.2)",
      borderColor: "rgb(18, 31, 219)",
      borderWidth: 2,
      fill: false,
    },
  ];

  y_data = y_data.filter((item) => Array.isArray(item.data) && item.data[0]);

   let y_data_user = [
    {
      label: "α0",
      data: a0_user,
      backgroundColor: "rgba(3, 119, 252, 0.2)",
      borderColor: "rgba(3, 119, 252, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α1",
      data: a1_user,
      backgroundColor: "rgba(252, 177, 3, 0.2)",
      borderColor: "rgba(252, 177, 3, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α2",
      data: a2_user,
      backgroundColor: "rgba(11, 158, 45, 0.2)",
      borderColor: "rgba(11, 158, 45, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α3",
      data: a3_user,
      backgroundColor: "rgba(219, 18, 18, 0.2)",
      borderColor: "rgba(219, 18, 18, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α4",
      data: a4_user,
      backgroundColor: "rgba(18, 206, 219, 0.2)",
      borderColor: "rgb(18, 212, 219)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α5",
      data: a5_user,
      backgroundColor: "rgba(162, 18, 219, 0.2)",
      borderColor: "rgb(179, 18, 219)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α6",
      data: a6_user,
      backgroundColor: "rgba(108, 219, 18, 0.2)",
      borderColor: "rgb(98, 219, 18)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α7",
      data: a7_user,
      backgroundColor: "rgba(219, 18, 112, 0.2)",
      borderColor: "rgb(219, 18, 169)",
      borderWidth: 2,
      fill: false,
    },
    {
      label: "α8",
      data: a8_user,
      backgroundColor: "rgba(18, 31, 219, 0.2)",
      borderColor: "rgb(18, 31, 219)",
      borderWidth: 2,
      fill: false,
    },
  ]

  y_data_user = y_data_user.filter((item) => Array.isArray(item.data) && item.data[0]);

  return (
    <div>
      <div className="graph-container">
        {showInput ? (
          <GraphComponent
            x_data={ph}
            y_data={y_data_user}
            y_title={"Fraction of equilibrium (α)"}
            initial_limits={[0, 14, 0, 1]}
            graph_title={"Diagrama de distribuição de espécies"}
          />
        ) : (
          <GraphComponent
            x_data={ph}
            y_data={y_data}
            y_title={"Fraction of equilibrium (α)"}
            initial_limits={[0, 14, 0, 1]}
            graph_title={"Diagrama de distribuição de espécies"}
          />
        )}
      </div>
    </div>
  );
}

export default DDE;
