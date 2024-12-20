import React, { useRef, useEffect } from "react";
import SmilesDrawer from "smiles-drawer";

const SETTINGS = {
  width: 150,
  height: 150,
};

const SmileDrawerContainer = ({ smilesStr }) => {
    const imgRef = useRef(null);
    const drawer = new SmilesDrawer.SmiDrawer(SETTINGS); // Inicialize o drawer com opções

  useEffect(() => {
    if (imgRef.current) {
      // Certifique-se de que o imgRef está definido antes de usá-lo
      drawer.draw(smilesStr, imgRef.current, 'light');
    }
  }, [smilesStr, drawer]); // Re-executar o efeito se smilesStr ou drawer mudar

  return (
    <div>
      <img ref={imgRef} width={175} alt="SMILES structure" />
    </div>
  );
};

export default SmileDrawerContainer;

