import Container from "../../../components/body/container";
import Lista from '../../RelatorioAdesao/Lista';

export default function RelatorioAdesao({filters, icons}){
    // SETA FILTROS
    const handleSetFilters = (e) => {
        if(filters){
            filters(e);   
        }        
    }

    // SETA ÍCONES
    const handleSetIcons = (e) => {
        if(icons){
            icons(e);
        }        
    }

    return(
        <Container>
            <Lista
                filters={handleSetFilters}
                icons={handleSetIcons}
                sistema_id={223}
            />
        </Container>
    )
}
