import { useContext, useEffect, useState } from "react";
import style from './style.module.scss';
import Container from "../../components/body/container";
import Input from "../../components/body/form/input";
import Gerenciador from "../../components/body/gerenciador";
import Table from "../../components/body/table";
import Tbody from "../../components/body/table/tbody";
import Tr from "../../components/body/table/tr";
import Td from "../../components/body/table/tbody/td";
import axios from "axios";
import Icon from "../../components/body/icon";
import toast from "react-hot-toast";
import Loader from "../../components/body/loader";
import { AuthContext } from "../../context/Auth";
import { GlobalContext } from "../../context/Global";

export default function TrocarEmpreendimento(){
    // GLOBAL CONTEXT
    const { handleSetFilter } = useContext(GlobalContext);

    // AUTH CONTEXT
    const { authInfo, setAuthInfo, setLoadAuth, setAuthenticated } = useContext(AuthContext);

    // ESTADOS
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);

    // CARREGA LISTA
    useEffect(() => {
        handleSetFilter(true);
    }, []);

    // SETA ITENS VINDOS DA API
    const handleSetItems = (e) => {
        setItems(e);
    }

    // GET INFO COM NOVO TOKEN
    function get_info(token){
        axios({
            method: 'get',
            url: window.backend+'/api/auth/user',
            headers: {
                'Authorization': 'Bearer '+ token
            }
        }).then((response) => {
            setAuthInfo(response?.data?.data);
            setLoadAuth(false);
            setAuthenticated(true);

            axios.defaults.headers.common['Authorization'] = 'Bearer '+ token;
            window.rs_id_grupo = response?.data?.data?.empreendimento?.id_grupo; 
            window.rs_id_emp = response?.data?.data?.empreendimento_id; 
            window.rs_id_emp_grupo = response?.data?.data?.id_emp_grupo; 
            window.rs_id_usr = response?.data?.data?.id;
            window.rs_id_lja = response?.data?.data?.loja_id;
            window.rs_name_usr = response?.data?.data?.pessoa?.nome;
            window.token = token;
        }).catch(() => {
            localStorage.clear();
            setAuthenticated(false);
            window.location.href = 'auth/login';
        });
    }

    // TROCA EMPREENDIMENTO
    const handleChange = (id) => {
        if(id){
            setLoading(id);

            axios({
                method: 'post',
                url: window.backend+'/api/v1/usuarios/troca/empreendimento',
                data: {
                    empreendimento_id: id
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then((response) => {
                if(response?.data){
                    toast('Empreendimento alterado');
                    get_info(response?.data?.token);
                }
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
            });
        }
    }

    // RESETA EMPREENDIMENTO
    const handleResetEmp = () => {
        setLoading('reset');

        axios({
            method: 'post',
            url: window.backend+'/api/v1/usuarios/troca/empreendimento',
            data: {
                empreendimento_id: authInfo?.empreendimento_original
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then((response) => {
            if(response?.data){
                toast('Empreendimento resetado');
                get_info(response?.data?.token);
            }
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
        });
    }

    return(
        <Container>
            <Gerenciador 
                id="empreendimento"
                title="Empreendimentos"
                className={style.gerenciador}
                search={
                    <Input
                        name="filter_empreendimento"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
                icon={
                    (authInfo?.empreendimento_id != authInfo?.empreendimento_original ?
                        <Icon
                            type="voltar"
                            title="Voltar para o empreendimento original"
                            loading={loading === 'reset' ? true : false}
                            onClick={handleResetEmp}
                            animated
                        />
                    :'')
                }
            >
                <Table
                    id="table_enterprise"
                    api={window.backend+'/api/v1/utilities/filters/'+(window.rs_id_emp_original == 26 ? 'empreendimentos' : 'grupo-empreendimento')}    
                    params={{
                        filter_search: filter 
                    }}                
                    key_aux={['data']}
                    pages={true}
                    search={filter}
                    onLoad={handleSetItems}
                >       
                    <Tbody>
                        {(items?.filter((elem) => elem.id != authInfo?.empreendimento_id).map((item, i) => {
                            return(
                                <Tr key={item?.id}>
                                    <Td
                                        cursor="pointer"
                                        onClick={() => handleChange(item?.id)}
                                    >
                                        {item?.nome}
                                    </Td>

                                    <Td width={1}>
                                        {(loading === item?.id && <Loader />)}
                                    </Td>
                                </Tr>
                            )
                        }))}
                    </Tbody>
                </Table>
            </Gerenciador>
        </Container>
    )
}
