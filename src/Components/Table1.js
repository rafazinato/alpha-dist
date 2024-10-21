import "../assets/table1.css";

function Table1({ compound }) {
  compound.charge_protonated = Number(compound.charge_protonated);

  function maketable() {
    let listpka = [compound.pka1, compound.pka2, compound.pka3];

    let numberpka = listpka.filter((v) => v).length;
    let alfascharge = [compound.charge_protonated];
    for (let i = 0; i < numberpka; i++) {
      alfascharge.push(alfascharge[alfascharge.length - 1] - 1);
    }

    listpka = listpka.map((i) => (i == "" ? "--" : i));
    let indexOfMax = alfascharge.map(Math.abs).indexOf(Math.max(...alfascharge.map(Math.abs)));
    let maxcharge =
      alfascharge[indexOfMax];
    listpka.unshift(maxcharge);


    return (
      <>
        <table className="table1">
          <thead>
            <tr>
            <th>Carga máxima</th>
              <th>pKA<sub>1</sub></th>
              <th>pKA<sub>2</sub></th>
              <th>pKA<sub>3</sub></th>
            </tr>
          </thead>
          <tr>
            {listpka.map((pka, index) => (
              <td key={index}>{pka}</td>
            ))}{" "}
            {/* Lembre-se da key no map */}
          </tr>
        </table>
      </>
    );
  }

  return <>{maketable()}</>;
}

export default Table1;
