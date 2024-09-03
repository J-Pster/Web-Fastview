import React, { useEffect, useMemo, useCallback, createContext, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { cd, get_date } from "../_assets/js/global";

export const JobsContext = createContext();

export const JobsProvider = ({ children, visitas, fases, chamados }) => {
    // COOKIES
    const [cookie, setCookie] = useCookies(['smallCard']);

    // ESTADOS
    const [optionsStatus, setOptionsStatus] = useState([]);
    const [optionsStatusMensagem, setOptionsStatusMensagem] = useState([]);
    const [optionsAvaliacao, setOptionsAvaliacao] = useState([]);
    const [optionsLoja, setOptionsLoja] = useState([]);
    const [optionsSystems, setOptionsSystems] = useState([]);
    const [filterEmpreendimento, setFilterEmpreendimento] = useState([]);
    const [autoSwiper, setAutoSwiper] = useState(true);
    const [configuracoes, setConfiguracoes] = useState(null);
    const [idUsuarioEmpresas, setIdUsuarioEmpresas] = useState(null);
    const [permissaoPedidos, setPermissaoPedidos] = useState(false);
    const [pedidos, setPedidos] = useState(0);
    const [smallCard, setSmallCard] = useState(cookie?.smallCard ? cookie?.smallCard : false);    

    // FUNÇÃO PARA BUSCAR CONFIGURAÇÕES DO EMPREENDIMENTO
    useEffect(() => {
        if(sessionStorage.getItem('sistema_id')){
            if((window.rs_sistema_id == global.sistema.manutencao_madnezz && idUsuarioEmpresas) || window.rs_sistema_id != global.sistema.manutencao || window?.location?.origin?.includes('madnezz') || window?.location?.origin?.includes('localhost')){           
                setConfiguracoes(null);
                
                axios({
                    method: 'get',
                    url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
                    params: {
                        db_type: global.db_type,
                        do: 'getTable',
                        tables: [
                            {table: 'configJob'}, // CONFIGURAÇÕES DOS CARDS
                            {table: 'assessment'}, // AVALIAÇÕES (CHAMADOS)
                            {table: 'status'}, // CORES DOS CARDS
                            (visitas ? {table: 'store'} : {}), // OPÇÕES DE LOJAS (LOCALIZAÇÃO VISITAS)
                            (fases ? {table: 'cardStatus'} : {}) // OPÇÕES DE STATUS DE MENSAGENS
                        ]
                    }
                }).then((response) => {
                    if(response.data){
                        setConfiguracoes(response?.data?.data?.configJob);
                        setOptionsStatus(response?.data?.data?.status);
                        setOptionsStatusMensagem(response?.data?.data?.cardStatus);
                        setOptionsAvaliacao(response?.data?.data?.assessment);
                        setOptionsLoja(response?.data?.data?.store);
                    }
                });
            }
        }
    },[filterEmpreendimento?.toString(), idUsuarioEmpresas, sessionStorage.getItem('sistema_id')]);

    // VERIFICA SE O USUÁRIO TEM PERMISSÃO NO SISTEMA DE PEDIDOS
    useEffect(() => {
        if((window?.location?.origin?.includes('madnezz')) && chamados && global?.sistema?.manutencao_madnezz != window.rs_sistema_id){
            axios({
                method: 'get',
                url: window.host+'/api/permissoes.php',
                params: {
                    do: 'get_acesso',
                    id_sistema: [global?.sistema?.pedidos]
                }
            }).then((response) => {
                if(response?.data){
                    if(parseInt(response?.data.filter((elem) => elem.sistema_id == global?.sistema?.pedidos)[0]?.permissao) > 0){
                        setPermissaoPedidos(true);
                    }
                }
            });
        }
    },[]);

    // VERIFICA SE O USUÁRIO POSSUI PEDIDOS PENDENTES E SE O EMPREENDIMENTO POSSUI ESSA CONFIGURAÇÃO ATIVADA
    useEffect(() => {
        if(permissaoPedidos){         
            axios({
                method: 'get',
                url: window.host+'/systems/pedidos/api/pendentes_usuario.php',
                params: {
                    do: 'total'
                }
            }).then((response) => {
                if(response.data){
                    setPedidos(response.data?.pendentes);
                }
            });            
        }
    },[permissaoPedidos]); 

    // FUNÇÃO PARA BUSCAR ID DO USUÁRIO NAS OUTRAS EMPRESAS
    useEffect(() => {
        // BUSCA ID DO USUÁRIO NAS OUTRAS EMPRESAS
        if(window.rs_sistema_id == global.sistema.manutencao && (!window?.location?.origin?.includes('madnezz') && !window?.location?.origin?.includes('localhost'))){
            axios({
                method: 'get',
                url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Table",
                params: {
                    db_type: global.db_type,
                    do: 'getUser',
                    permission: false,
                    id_emp: '|NOT VALUE|',
                    id_fastview: (window?.location?.origin?.includes('fastview') ? window?.rs_id_usr : undefined),
                    id_malltech: (window?.location?.origin?.includes('malltech') ? window?.rs_id_usr : undefined)
                }
            }).then((response) => {
                setIdUsuarioEmpresas(response?.data?.data[0]);
            });
        }
    },[]);

    // FILTER EMPREENDIMENTO
    const handleSetFilterEmpreendimento = useCallback((value) => {
        setFilterEmpreendimento(value);
    },[filterEmpreendimento]);

    // AUTO SWIPER
    const handleSetAutoSwiper = useCallback((value) => {
        setAutoSwiper(value);
    },[autoSwiper]);

    // SETA OPTIONS SYSTEMS
    const handleSetOptionsSystems = useCallback((value) => {
        setOptionsSystems(value);
    },[autoSwiper]);

    // SETA SMALL CARD
    const handleSetSmallCard = useCallback((value) => {
        setSmallCard(value);
        let date_aux = cd(new Date()) + ' 00:00:00';
        date_aux = get_date('date_sql', date_aux, 'date_add_year', 1);

        setCookie('smallCard', value, {path: '/', expires: new Date(date_aux)}); // SALVA EM COOKIE
    },[smallCard]);

    const value = useMemo(
        () => ({
            optionsStatus,
            optionsStatusMensagem,
            optionsAvaliacao,
            optionsLoja,
            optionsSystems,
            handleSetOptionsSystems,
            filterEmpreendimento,
            handleSetFilterEmpreendimento,
            autoSwiper,
            handleSetAutoSwiper,
            configuracoes,
            idUsuarioEmpresas,
            permissaoPedidos,
            pedidos,
            smallCard,
            handleSetSmallCard
        }),
        [
            optionsStatus,
            optionsStatusMensagem,
            optionsAvaliacao,
            optionsLoja,
            optionsSystems,
            handleSetOptionsSystems,
            filterEmpreendimento,
            handleSetFilterEmpreendimento,
            autoSwiper,
            handleSetAutoSwiper,
            configuracoes,
            idUsuarioEmpresas,
            permissaoPedidos,
            pedidos,
            smallCard,
            handleSetSmallCard
        ]
      );

    return (
        <JobsContext.Provider value={value}>{children}</JobsContext.Provider>
    );
};
