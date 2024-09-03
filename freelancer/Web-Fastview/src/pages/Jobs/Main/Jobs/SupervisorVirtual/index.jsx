import Header from "./Header";
import Container from '../../../../../components/body/container';
import Ranking from "./Ranking";
import History from "./History";
import style from './style.module.scss';
import SelectReact from '../../../../../components/body/select';
import { useEffect, useState } from "react";

export default function Supervisor({ icons, filters, container }){
    // ESTADOS
    const [period, setPeriod] = useState(2);

    // MANDA FILTROS E ÍCONES PRO COMPONENTE PAI
    useEffect(() => {
        if(filters){
            filters(
                <></>
            );
        }

        if(icons){
            icons(<></>);
        }

        if(container){
            container(false)
        }
    },[period]);

    return(
        <>
            <Header
                period={period}
            />

            <Container>
                <div className={style.body_container}>
                    <Ranking 
                        period={period}
                    />

                    <History
                        period={period}
                    />
                </div>
            </Container>
        </>
    )
}
