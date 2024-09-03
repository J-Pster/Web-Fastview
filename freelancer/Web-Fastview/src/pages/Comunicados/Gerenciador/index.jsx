import { useContext, useEffect } from 'react';
import Row from '../../../components/body/row';
import GerenciadorJobs from '../../Jobs/Gerenciador/Configuracoes';
import { GlobalContext } from '../../../context/Global';

export default function Gerenciador(){
    // GLOBAL CONTEXT
    const { handleSetFilter } = useContext(GlobalContext);

    // HABILITA O LOAD DO RELATÓRIO NOVAMENTE
    useEffect(() => {
        handleSetFilter(true);
    }, []);

    return(
        <GerenciadorJobs
            id_emp={window.rs_id_emp != 26 ? window.rs_id_emp : undefined}
            integrated={false}
            comunicados={true}
        />
    )
}
