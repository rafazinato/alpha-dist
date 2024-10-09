import "../assets/systemselection.css"
import 'material-symbols'
import Form from 'react-bootstrap/Form';
import data1 from "../data/Pasta1.csv";
import * as Papa from "papaparse";
import React, { useState, useEffect, useRef } from "react";

function SystemSelection({setCompound, data}) {

    const listName = data.map((compounds, index) => <option id={compounds.index}>{compounds.name}</option>)


    const handleId = (i) => {
        let idx = data.findIndex((item) => item.name == i);
        setCompound({
            name: data[idx].name,
            smiles: data[idx].smile,
            pka1: data[idx].pka1,
            pka2: data[idx].pka2,
            pka3: data[idx].pka3, 
        })

    };
    return (
        <div className="grid">
            <div className="grid-item-1">
            Seleção de sistema:
            </div>
            <div className="grid-item-2">
            <Form.Select aria-label="Default select example" id='select-menu' onChange={(e) => handleId(e.target.value)}>
                {listName}
            </Form.Select>
            </div>
            <div className="grid-item-3">
                Descrição
            </div>
            <div className="grid-item-4">
                Seleção de base de dados:
            </div>
            <div className="grid-item-5">
            <Form.Select aria-label="Default select example" id='select-menu' >
                <option value={"0"}>Open this select menu</option>
                <option value={"1"}>One</option>
                <option value={"2"}>Two</option>
                <option value={"3"}>Three</option>
            
            </Form.Select>
            </div>
            <div className="grid-item-6">
                Descrição
            </div>
        </div>
        
    );
}

export default SystemSelection