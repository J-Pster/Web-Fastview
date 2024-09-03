import { useParams } from "react-router";
import Iframe from "../../components/body/iframe";

export default function MicrossistemasLegado(){
    const params = useParams();

    return(
        <Iframe url={'systems/microssistemas-novo/?id_aux='+params['*']} />
    )
}