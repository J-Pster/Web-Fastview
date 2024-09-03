import Container from "../../../components/body/container";
import Comunicados from "../../Comunicados/Lista";

export default function ComunicadosJobs({ icons, filters }) {
    // MANDA ÍCONES PRO COMPONENTE PAI
    const handleSetIcons = (e) => {
        if(icons){
            icons(e);
        }
    }

    // MANDA FILTROS PRO COMPONENTE PAI
    const handleSetFilters = (e) => {
        if(filters){
            filters(e);
        }
    }

    return(
        <Container>
            <Comunicados
                icons={handleSetIcons}
                filters={handleSetFilters}
                integrated={true}
            />
        </Container>
    )
}