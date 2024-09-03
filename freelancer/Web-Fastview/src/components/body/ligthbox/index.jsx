import React, { useState, useContext } from "react";
import FsLightbox from "fslightbox-react";
import { GlobalContext } from '../../../context/Global';

export default function Lightbox(props){
    // CONTEXT
    const { handleSetToggler, toggler } = useContext(GlobalContext);

    return(
        <FsLightbox
            toggler={props.toggler}
            sources={props.sources}
            onClose={() => handleSetToggler(false)}
        />
    );    
}
