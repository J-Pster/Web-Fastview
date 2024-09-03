import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../../../components/body/loader";
import Icon from "../../../../components/body/icon";

export default function Usuario({item}){
    return(
        <li>
            <span>
                {item.nome}
            </span>
        </li>
    )
}
