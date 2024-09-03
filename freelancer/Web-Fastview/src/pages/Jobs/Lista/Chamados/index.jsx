import { useEffect } from "react";
import { useState } from "react";
import SelectReact from "../../../../components/body/select";
import ListaJobs from '../Jobs';
import Macro from "./Macro";
import Container from "../../../../components/body/container";

export default function Lista({icons, filters}){
    // ESTADOS
    const [filterTipo, setFilterTipo] = useState(1);
    const [filtersAux, setFiltersAux] = useState(null);

    // OPTIONS TIPO
    const optionsTipo = [
        {value: 1, label: 'Lista'},
        {value: 2, label: 'Macro'}
    ]

    // MANDA FILTROS PRO COMPONENTE PAI
    useEffect(() => {
        if(filters){
            filters(
                <>
                    {/* <SelectReact
                        options={optionsTipo}
                        placeholder="Tipo"
                        name="tipo"
                        value={filterTipo}
                        allowEmpty={false}
                        onChange={(e) => setFilterTipo(e.value)}
                    /> */}

                    {filtersAux}
                </>
            )
        }
    },[filterTipo, filtersAux]);

    // MANDA ICONES PRO COMPONENTE PAI
    const handleSetIcons = (e) => {
        if(icons){
            icons(e);
        }
    }

    const handleSetFilters = (e) => {
        setFiltersAux(e);
    }

    // RENDEREIZAÇÃO DO COMPONENTE
    if(filterTipo === 1 ){
        return(
            // LISTA PADRÃO DO JOBS
            <ListaJobs filters={handleSetFilters} icons={handleSetIcons} chamados={true} />
        )
    }else{
        return(
            // LISTA MACRO COM A QUANTIDADE DE CADA MÓDULO
            <Container>
                <Macro filters={handleSetFilters} icons={handleSetIcons} />
            </Container>
        )
    }
}
