import style from './style.module.scss';
import Container from '../../../components/body/container';
import User from './User';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Input from '../../../components/body/form/input';
import Loader from '../../../components/body/loader';
import FilterCheckbox from '../../../components/body/filterCheckbox';

export default function Timeline({filters, icons, chamados, fases, visitas}){
    // ESTADOS
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [configuracoes, setConfiguracoes] = useState([]);

    // ESTADOS DE FILTROS
    const [filterDate, setFilterDate] = useState(new Date());
    const [filterTipo, setFilterTipo] = useState(['143']);
    const [filterUsuario, setFilterUsuario] = useState([]);

    // HORÁRIOS
    // const hours = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
    const hours = ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];

    // TIPOS (CRAVEI NO CÓDIGO PORQUE OS NOMES DA API SÃO CONFUSOS PARA O USUÁRIO, E ALGUNS TIPOS NÃO PRECISAM SER FILTRADOS)
    const tipos = [
        {id: '137', nome: 'Anexou arquivo'},
        {id: '403', nome: 'Arquivou'},
        {id: '134', nome: 'Avaliou'},
        {id: '131', nome: 'Cadastrou'},
        {id: '144', nome: 'Editou'},
        {id: '143', nome: 'Marcou em execução'},
        {id: '861', nome: 'Abriu o card'},
        {id: '140', nome: 'Trocou de operador'},
        {id: '550', nome: 'Alterou a posição'},
        {id: '139', nome: 'Marcou como recebido'},
        {id: '132', nome: 'Finalizou o card'},
        {id: '133', nome: 'Checou o card'},
    ];

    // BUSCA CONFIGURAÇÕES DE TODOS OS SISTEMAS
    useEffect(() => {
        axios({
            method: 'get',
            url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
            params: {
                db_type: global.db_type,
                do: 'getTable',
                tables: [
                    {table: 'configJob', filter: {id_apl: [223, 224, 225, 226]}}
                ]
            }
        }).then((response) => {
            if(response.data){
                setConfiguracoes(response?.data?.data?.configJob);
            }
        });
    },[]);

    // BUSCA LISTA DE USUÁRIOS COM ACESSO AO SISTEMA
    useEffect(() => {
        axios({
            url: window.backend+'/api/v1/utilities/filters/usuarios',
            params: {
                do: 'select',
                component: 'usuario',                
                filter_id_enterprise: [window.rs_id_emp],
                filter_sistemas: [window.rs_sistema_id]
            }
        }).then((response) => {
            if(response?.data){
                setUsers(response?.data?.data);
            }

            setLoading(false);
        })
    },[]);

    // ENVIA FILTROS PRO COMPONENTE PAI
    useEffect(() => {
        if(filters){
            filters(
                <>
                    <FilterCheckbox
                        name="filter_tipo"
                        options={tipos}
                        // api={{
                        //     url: window.host + '/systems/integration-react/api/request.php?type=Job',
                        //     params: {
                        //         db_type: global.db_type,
                        //         do: 'getTable',
                        //         tables: [{
                        //             table: 'logType'
                        //         }]
                        //     },
                        //     key_aux:['data','logType']
                        // }}
                        textCapitalize={false}
                        onChangeClose={(e) => setFilterTipo(e)}
                        value={filterTipo}
                    >
                        Tipos
                    </FilterCheckbox>

                    <FilterCheckbox
                        name="filter_usuario"
                        options={tipos}
                        api={{
                            url: window.backend+'/api/v1/utilities/filters/usuarios',
                            params: {
                                do: 'select',
                                component: 'usuario',
                                filter_id_enterprise: [window.rs_id_emp],
                                filter_sistemas: [window.rs_sistema_id]
                            },
                            key_aux: ['data']
                        }}
                        textCapitalize={false}
                        onChangeClose={(e) => setFilterUsuario(e)}
                        value={filterUsuario}
                    >
                        Usuários
                    </FilterCheckbox>

                    <Input
                        type="date"
                        required={false}
                        value={filterDate}
                        onChange={(e) => setFilterDate(e)}
                    />
                </>
            )
        }
    },[filterDate]);

    if(loading){
        return <Loader fullHeight/>;
    }else{
        return(
            <Container padding={false} className={style.container}>
                <div className={style.timeline}>
                    <div className={style.hours}>
                        {(hours?.map((item, i) => {
                            return(
                                <div
                                    key={'hour_'+item}
                                    className={style.hour}
                                >
                                    <span>
                                        {item}
                                    </span>
                                </div>
                            )
                        }))}
                    </div>

                    <div className={style.users}>
                        {users?.map((item, i) => {
                            if(filterUsuario?.includes(item?.id?.toString()) || filterUsuario?.length === 0){
                                return(
                                    <User
                                        key={item?.id}
                                        user={item}
                                        hours={hours}
                                        chamados={chamados}
                                        fases={fases}
                                        visitas={visitas}
                                        configuracoes={configuracoes}
                                        filters={{
                                            filterDate: filterDate,
                                            filterTipo: filterTipo
                                        }}
                                    />
                                )
                            }
                        })}                
                    </div>
                </div>
            </Container>
        )
    }
}