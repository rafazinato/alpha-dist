import "../assets/table1.css";

function Table1({ compound }) {
  function maketable() {
    let listpka = [1, compound.pka1, compound.pka2, compound.pka3];
    listpka = listpka.map((i) => i == '' ? '--' : i)
    return (
      <>
        <table className="table1">
          <thead>
            <tr><th scope="col" colspan="4">
              Parâmetros do sistema
            </th></tr>
          </thead>
          <tbody>
            <tr className="second-row">
              <th>Carga máxima</th>
              <th>PKA1</th>
                <th>PKA2</th>
              <th>PKA3</th>

            </tr>
          </tbody>

          <tr>
            {listpka.map((pka, index) => (
              <th key={index}>{pka}</th>
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
