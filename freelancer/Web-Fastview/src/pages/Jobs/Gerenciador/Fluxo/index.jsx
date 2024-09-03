import { useEffect, useState } from "react";
import Categorias from "./Categorias";
import Icon from "../../../../components/body/icon";
import axios from "axios";
import Container from "../../../../components/body/container";

export default function Fluxo({dragScroll, icons, filters}){
    // ESTADOS
    const [zoom, setZoom] = useState(100);
    const [modulos, setModulos] = useState([]);
    const [usuarios, setUsuarios] = useState(null);
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);
    const [collapseAll, setCollapseAll] = useState(false);

    // REMOVE ZOOM
    const handleZoomOut = () => {
        if(zoom >= 60){
            document.getElementById('container').style.zoom = ((zoom - 20)+'%');
            setZoom((zoom - 20));
        }
    }

    // ADICIONA ZOOM
    const handleZoomIn = () => {
        if(zoom <= 100){
            document.getElementById('container').style.zoom = ((zoom + 20)+'%');
            setZoom((zoom + 20));
        }
    }

    // AJUSTA HEIGHT DO CONTAINER DE ACORDO COM O ZOOM
    useEffect(() => {
        if(document.getElementById('container')){
            if(zoom == 40){
                document.getElementById('container').style.height = 'calc(100vh + 1077px)';
            }else if(zoom == 60){
                document.getElementById('container').style.height = 'calc(100vh + 403px)';
            }else if(zoom == 80){
                document.getElementById('container').style.height = 'calc(100vh + 67px)';
            }else if(zoom == 100){
                document.getElementById('container').style.height = 'calc(100vh - 136px)';
            }else if(zoom == 120){
                document.getElementById('container').style.height = 'calc(-271px + 100vh)';
                document.getElementById('container').style.minHeight = 'calc(-271px + 100vh)';
            }
        }
    },[zoom]);

    // GET MÓDULOS
    useEffect(() => {
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
            params: {
                db_type: 'sql_server',
                do: 'getTable',
                tables: [{
                    table: 'moduleChamados',
                    filter: {
                        ativo: 1,
                        id_emp: window.rs_id_emp,
                        id_apl: window.rs_id_apl,
                        module_permission: 'FALSE',
                        colunas: 1
                    }
                }]
            }
        }).then((response) => {
            if(response?.data?.data?.moduleChamados){
                setModulos(response?.data?.data?.moduleChamados);
            }
        });
    },[]);

    // GET USUÁRIOS MÓDULO
    function get_user_modules(id_modulo){
        if(!id_modulo){
            setLoadingUsuarios(true);
        }

        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                type: 'Job',
                do: 'getTable',
                tables: [{
                    table: 'userModules',
                    modulo_id: id_modulo
                }]
            }
        }).then((response) => {
            if(response?.data?.data?.userModules){
                if(id_modulo){
                    setUsuarios(usuarios => [...usuarios?.filter((elem) => elem?.id_modulo != id_modulo), ...response.data.data?.userModules]);
                }else{
                    setUsuarios(response?.data?.data?.userModules);
                }
            }
            setLoadingUsuarios(false);
        }).catch(() => {
            setLoadingUsuarios(false);
        });
    }

    // CHAMADA DA FUNÇÃO DE GET USERS
    useEffect(() => {
        get_user_modules(); // FAZER A REQUISIÇÃO INICIAL COM TODOS OS MÓDULOS JUNTOS
    },[]);

    // ENVIA INFORMAÇÃO PRO COMPONENTE PAI HABILITAR O DRAG SCROLL
    useEffect(() => {
        if(dragScroll){
            dragScroll(true);
        }

        if(icons){
            if(!window.isMobile){
                icons(
                    <>
                        <Icon type="zoomOut" title="Menos zoom" onClick={handleZoomOut} disabled={zoom == 40 ? true : false} />
                        <Icon type="zoomIn" title="Mais zoom" onClick={handleZoomIn} disabled={zoom == 120 ? true : false} />    
                        <Icon
                            type={collapseAll ? 'expand-card' : 'retract-card'}
                            title={collapseAll ? 'Maximizar todos' : 'Minimizar todos'}
                            animated
                            onClick={() => setCollapseAll(!collapseAll)}
                         />                
                    </>
                );
            }else{
                icons(<></>);
            }
        }

        if(filters){
            filters(<></>);
        }
    },[zoom, collapseAll]);

    // CALLBACK DA CATEGORIA
    const handleCallbackCategoria = (e) => {
        if(e?.user){
            get_user_modules();
        }

        if(e?.includeUser){
            get_user_modules(e?.includeUser?.id_modulo);
        }
    }

    return(
        <Container dragScroll={true}>
            <Categorias
                modulos={modulos}
                usuarios={loadingUsuarios ? 'loading' : usuarios}
                collapseAll={collapseAll}
                callback={handleCallbackCategoria}
            />
        </Container>
    )
}