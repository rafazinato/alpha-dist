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
      <div>
        <table className="table1">
          <thead className="table1-header">
            <tr>
            <th colSpan={2}>Carga máxima</th>
              <th>pKA<sub>1</sub></th>
              <th>pKA<sub>2</sub></th>
              <th>pKA<sub>3</sub></th>

            </tr>
          </thead>
          <tr>
              <th colSpan={2}>{maxcharge}</th>
              <th>{compound.pka1 ? compound.pka1 : '--'}</th>
              <th>{compound.pka2 ? compound.pka2 : '--'}</th>
              <th>{compound.pka3 ? compound.pka3 : '--'}</th>
          </tr>
        </table>
        <table className="table1-rest">
        <thead >
          <tr>
              <th>pKA<sub>4</sub></th>
              <th>pKA<sub>5</sub></th>
              <th>pKA<sub>6</sub></th>
              <th>pKA<sub>7</sub></th>
              <th>pKA<sub>8</sub></th>
          </tr>
          </thead>
          <tr>
              <th>{compound.pka4 ? compound.pka4 : '--'}</th>
              <th>{compound.pka5 ? compound.pka5 : '--'}</th>
              <th>{compound.pka6 ? compound.pka6 : '--'}</th>
              <th>{compound.pka7 ? compound.pka7 : '--'}</th>
              <th>{compound.pka8 ? compound.pka8 : '--'}</th>
          </tr>
        </table>
      </div>
    );
  }

  return <>{maketable()}</>;
}

export default Table1;
