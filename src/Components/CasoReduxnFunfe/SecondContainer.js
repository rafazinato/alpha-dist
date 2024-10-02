import React from 'react'
import DDE from '../DDE';
import Table2 from '../Table2';
import Table1 from '../Table1';
import Molecule from '../Molecule';
import '../App.css';

export default function SecondContainer() {
  return (
<>

        <div className="background-molecule">
          <Molecule />
        </div>
        <div className="table-1">
          <Table1 />
        </div>


    
      {/* DIV que envolve o DDE e tabela 2 */}
    <div className='container-second'>
        <div className='dde'>
            <DDE />
        </div>
        <div className='table-2'>
        <Table2 />
        </div>
    </div>
</>
  )
}
