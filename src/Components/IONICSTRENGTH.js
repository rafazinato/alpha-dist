import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../assets/graphs.css";
import GraphComponent from "./GraphComponent";
import { useMemo } from "react";

function arange(start, stop, step = 1) {
  let result = [];
  for (let i = start; i < stop; i += step) {
    result.push(i);
  }
  return result;
}

function IONICSTRENGTH({ compound, alfascharge, chosenconc,alfascharge_user, pkauser, showInput }) {
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

  let pKw = 14;
  let ph = arange(0, 14, 0.05);
  let qwat = ph.map((ph) => (10 ** -ph) ** 2 + (10 ** (ph - pKw)) ** 2);

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

  // criando o cálculo da carga efetiva
  let alpha_list = [a0, a1, a2, a3, a4, a5, a6, a7, a8];
  let each_charge_quad = ph.map((ph, phindex) =>
    alfascharge.map(
      (charge, index) => Number(charge**2) * Number(alpha_list[index][phindex])
    )
  );

  let qquad = [];

  each_charge_quad.forEach((num) => {
    qquad.push(num.reduce((acc, curr) => acc + curr, 0));
  });

  let each_charge_quad_user = ph.map((ph, phindex) =>
    alfascharge_user.map(
      (charge, index) =>
        Number(charge**2) * Number(alpha_list_user[index][phindex])
    )
  );


  // qquad = alpha.map((e,idx) => (e*((alfascharge[idx]))**2))
  // qquad = qquad.reduce(
  //   (accumulator, currentValue) => accumulator + currentValue,
  //   0,
  // );
  //.reduce((accumulator, currentValue) => accumulator + currentValue,0)
  // console.log(alpha_list)

  // let qquad = (ph.map((ph, phindex) => (alfascharge.map((e,idx) => alpha_list[idx][phindex]*(e)**2))))
  // console.log(alfascharge) 
  // console.log(qquad)  

  let ionic_strength =  qquad.map( qquad => (1 / 2) * chosenconc * qquad )


  let qquad_user = useMemo(() => {
      const tempReference = [];
      each_charge_quad_user.forEach((num) => {
        tempReference.push(num.reduce((acc, curr) => acc + curr, 0));
      });
      return tempReference;
    }, [each_charge_quad_user]);

  let ionic_strength_user = qquad_user.map(
    (qquad_user) => (1 / 2) * chosenconc * qquad_user ** 2
  );

  let total = ionic_strength.map( (e,idx) => e + qwat[idx])
  let total_user = ionic_strength_user.map( (e,idx) => e + qwat[idx])
  let y_data = [
    {
      label: "Total",
      data: total,
      backgroundColor: "rgba(219, 18, 18, 0.2)",
      borderColor: "rgba(219, 18, 18, 1)",
      borderWidth: 2,
      fill: false,
      },
    {
      label: "Sistema",
      data: ionic_strength,
      backgroundColor: "rgba(11, 158, 45, 0.2)",
      borderColor: "rgba(11, 158, 45, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
    label: "Água",
    data: qwat,
    backgroundColor: "rgba(3, 119, 252, 0.2)",
    borderColor: "rgba(3, 119, 252, 1)",
    borderWidth: 2,
    fill: false,
    }

  ]

  let y_data_user = [
    {
      label: "Total",
      data: total_user,
      backgroundColor: "rgba(219, 18, 18, 0.2)",
      borderColor: "rgba(219, 18, 18, 1)",
      borderWidth: 2,
      fill: false,
      },
    {
      label: "Sistema",
      data: ionic_strength_user,
      backgroundColor: "rgba(11, 158, 45, 0.2)",
      borderColor: "rgba(11, 158, 45, 1)",
      borderWidth: 2,
      fill: false,
    },
    {
    label: "Água",
    data: qwat,
    backgroundColor: "rgba(3, 119, 252, 0.2)",
    borderColor: "rgba(3, 119, 252, 1)",
    borderWidth: 2,
    fill: false,
    }
  ]

  let max_limit_inital = Math.max(ionic_strength)
  let max_limit_inital_user = Math.max(ionic_strength_user)
  return (
    <div>
      {/* <p className="graph-title">Força Iônica</p> */}
      <div class="graph-container">
        {/* <canvas ref={chartRef} /> */}
        {showInput ? (
        <GraphComponent
        x_data={ph}
        y_data={y_data_user}
        y_title={"Ionic Strength /(mol/L)"}
        initial_limits={[0, 14, 0, max_limit_inital_user]}
        graph_title={"Força Iônica"}
      />
        ) : (
          <GraphComponent
          x_data={ph}
          y_data={y_data}
          y_title={"Ionic Strength /(mol/L)"}
          initial_limits={[0, 14, 0, max_limit_inital]}
          graph_title={"Força Iônica"}
        />
        )}

      </div>
    </div>
  );
}

export default IONICSTRENGTH;
