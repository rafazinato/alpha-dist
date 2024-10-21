import React, { useState,} from "react";
import "../assets/table2.css";
function Table2({compound,alfascharge}) {
   const [chosenph,setChosenPh] = useState() 

    const pka = [Number(compound.pka1), Number(compound.pka2), Number(compound.pka3)].filter(v=>v!=0);


    function calcAlpha(ph, pka) {
        let alpha = [];
    
        let denominator = 1;
        pka.forEach((element, idx) => {
            denominator += element ? 10 ** ((idx+1) * ph - pka.slice(0, idx+1).reduce((acc, curr) => acc + curr, 0)) : 0;
        });
    
        // alpha 0
        alpha.push(1 / denominator);
    
        // other alphas
        pka.forEach((element, idx) => {
            if (element) alpha.push(alpha[0] * 10 ** ((idx+1) * ph - pka.slice(0, idx+1).reduce((acc, curr) => acc + curr, 0)))
        });
    
        return alpha;
    }

    let alpha = calcAlpha(chosenph,pka)
    let each_charge = alfascharge.map((charge,index) =>  Number(charge)*Number(alpha[index]))
    let effective_charge = 0;

    // calculate effective charge using forEach() method
    each_charge.forEach( num => {
        effective_charge += num;
    })
    let qquad = 0
    for (let i = 0; i < alpha.length;i++) {
        qquad += 1/2*alpha[i]*each_charge[i]**2
    }

    // calculo do Wat para temperatura ambiente
    let pKw = 14 
    let wat = 10**(-chosenph) - 10**(chosenph - pKw)


    



    function maketable2() {

        return(
            <table className="table2">
                <thead>
                    <th>α</th>
                    <th>Valores</th>
                    <th>log α</th>
                    <th>Parâmetros</th>
                    <th>Valores</th>
                </thead>
                <tr>
                    <td>α<sub>0</sub></td>
                    <td>{Number(alpha[0]) ? alpha[0].toFixed(4) : '--'}</td>
                    <td>{Math.log10(Number(alpha[0])) ? Math.log10(Number(alpha[0])).toFixed(4) : '--'}</td>
                    <td>Wat</td>
                    <td>{wat.toExponential(4)}</td>
                </tr>

                <tr>
                    <td>α<sub>1</sub></td>
                    <td>{Number(alpha[1]) ? alpha[1].toFixed(4) : '--'}</td>
                    <td>{Math.log10(Number(alpha[1])) ? Math.log10(Number(alpha[1])).toFixed(4) : '--'}</td>
                    <td>q<sub>ef</sub></td>
                    <td>{effective_charge.toFixed(4)}</td>
                </tr>
                <tr>
                    <td>α<sub>2</sub></td>
                    <td>{Number(alpha[2]) ? alpha[2].toFixed(4) : '--'}</td>
                    <td>{Math.log10(Number(alpha[2])) ? Math.log10(Number(alpha[2])).toFixed(4) : '--'}</td>
                    <td><sub>β</sub></td>
                </tr>
                <tr>
                    <td>α<sub>3</sub></td>
                    <td>{Number(alpha[3]) ? alpha[3].toFixed(4) : '--'}</td>
                    <td>{Math.log10(Number(alpha[3])) ? Math.log10(Number(alpha[3])).toFixed(4) : '--'}</td>
                    <td>BC</td>
                </tr>
                <tr>
                    <td>α<sub>4</sub></td>
                    <td></td>
                    <td></td>
                    <td>q<sub>wat</sub></td>
                </tr>
                <tr>
                    <td>α<sub>5</sub></td>
                    <td></td>
                    <td></td>
                    <td>q<sub>quad</sub></td>
                    <td>{qquad.toFixed(4)}</td>
                </tr>

            </table>
        );
        }

    return (
        <>
            <div className="ph-selection">
                <p>Informe um pH: </p>
                <input  onChange={(e) => setChosenPh(e.target.value.replace(',', '.'))} id='ph-input' ></input>
                {/* <button onClick={() => setChosenPh(document.getElementById('ph-input').value)}>Calcular</button> */}
            </div>


            {maketable2()}
        </>

    );
}

export default Table2