import Input from '../form/input';
import style from './style.module.scss';
import Man from '../../../_assets/img/man.png';
import Woman from '../../../_assets/img/woman.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Icon from '../icon';
import toast from 'react-hot-toast';
import Loader from '../loader';
import Tippy from '@tippyjs/react';
import Microssistema from '../../../pages/Microssistemas/Cadastro';
import Usuarios from './components/Usuarios';
import Item from './components/Item';
import Funcionarios from './components/Funcionarios';

export default function AtualizacaoCadastral(){
    // ESTADOS
    const [active, setActive] = useState(false);
    const [logoEmp, setLogoEmp] = useState(null);
    const [values, setValues] = useState(null);
    const [items, setItems] = useState([]);
    const [id, setId] = useState('');
    const [qtd_depois, setQtdDepois] = useState(0);
    const [qtd_depois_permitida, setQtdDepoisPermitida] = useState(0);
    const [idLog, setIdLog] = useState('');
    const [loading, setLoading] = useState(false);
    const [motivo, setMotivo] = useState('');
    const [microssistema, setMicrossistema] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [microssistemaValidation, setMicrossistemaValidation] = useState(true);
    const [microssistemaValues, setMicrossistemaValues] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [validacaoUsuarios, setValidacaoUsuarios] = useState(false);
    const [funcionarios, setFuncionarios] = useState([]);
    const [validacaoFuncionarios, setValidacaoFuncionarios] = useState(false);

    // GET LOGO EMPREENDIMENTO
    // useEffect(() => {
    //     axios({
    //         method: 'get',
    //         url: window.host+'/systems/gerenciador/api/settings.php',
    //         params: {
    //             do: 'fetchColumn',
    //             columns: [
    //                 {column: 'enterprise', filter: {id: window.rs_id_emp}}
    //             ]
    //         }
    //     }).then((response) => {
    //         if(response?.data?.enterprise?.data[0]?.logo){
    //             setLogoEmp(response?.data?.enterprise?.data[0]?.logo);
    //         }
    //     })
    // },[]);

    // ANEXO
    const handleSetValues = (e) => {
        let value_aux;
        let values_aux = Array.isArray(values) ? values : [];
        values_aux = values_aux.filter(item => !(e?.name in item));

        if(e?.value){     
            if(e?.type === 'image'){   
                if(e?.value?.includes('{')){ // VERIFICA SE ESTÁ RECEBENDO UMA STRING JSON E CONVERTE PARA PEGAR SOMENTE O ID
                    value_aux = JSON.parse(e?.value)[0]?.id;
                    let name_aux = e?.name;
                    let obj_aux = {};
                    obj_aux[name_aux] = value_aux;
                    values_aux.push(obj_aux);              
                }else{
                    // values_aux = value;
                }
            }else{
                let name_aux = e?.name;
                let obj_aux = {};

                obj_aux[name_aux] = e?.value;

                values_aux.push(obj_aux);
            }

            setValues(values_aux);
        }
    }

    // BUSCA LISTA DE USUÁRIOS
    function get_users(){
        axios({
            method: 'get',
            url: window.backend+'/api/v1/utilities/filters/usuarios',
            params: {
                filter_search_loja_id: [window.rs_id_lja],
                sistema_id: 223
            }
        }).then((response) => {
            if(response?.data?.data){
                setUsuarios(response.data.data);
            }
        });
    }

    // BUSCA LISTA DE USUÁRIOS
    function get_funcionarios(){
        axios({
            method: 'get',
            url: window.backend+'/api/v1/funcionarios',
            params: {
                lojas: [window.rs_id_lja]
            }
        }).then((response) => {
            if(response?.data?.data){
                setFuncionarios(response.data.data);
            }
        });
    }

    // VERIFICA SE A LOJA POSSUI INFORMAÇÕES PARA ATUALIZAR
    useEffect(() => {
        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                type: 'Table',
                do: 'getUpdateTable' 
            }
        }).then((response) => {                
            if(response?.data?.data){
                setItems(response?.data?.data?.loja?.columns);
                setId(response?.data?.data?.loja?.id);
                setQtdDepois(response?.data?.data?.loja?.row?.qtd_depois);
                setQtdDepoisPermitida(response?.data?.data?.loja?.row?.qtd_depois_permitida);
                setIdLog(response?.data?.data?.loja?.row?.id_log);
                setMotivo(response?.data?.data?.loja?.row?.motivo);
                setMicrossistema(response?.data?.data?.loja?.row?.microssistema_id);
                setTitulo(response?.data?.data?.loja?.row?.titulo);
                setDescricao(response?.data?.data?.loja?.row?.descricao);          
                
                if(response?.data?.data?.loja?.row?.coluna){
                    if(JSON.parse(response?.data?.data?.loja?.row?.coluna)?.filter((elem) => elem.name === 'usuarios').length > 0){
                        get_users();
                    }else {
                        setValidacaoUsuarios(true);
                    }
                    
                    if(JSON.parse(response?.data?.data?.loja?.row?.coluna)?.filter((elem) => elem.name === 'funcionarios').length > 0){
                        get_funcionarios();
                    }else{
                        setValidacaoFuncionarios(true);
                    }
                }else{
                    setValidacaoUsuarios(true);
                    setValidacaoFuncionarios(true);
                }

                // SETA LOGO SE A LOJA JÁ TIVER CADASTRADO
                let array_aux = [];

                if(response?.data?.data?.loja?.columns){
                    response?.data?.data?.loja?.columns.map((item, i) => {
                        let values_aux = {};
                        values_aux[item?.name] = item?.value;

                        if(item?.type === 'image'){      
                            let obj_aux;

                            if(item?.value){              
                                obj_aux = [{
                                    id: item?.value,
                                    name: '',
                                    size: '',
                                    type: ''
                                }];
                            }
        
                            // MONTA OBJETO PARA SETAR NO COMPONENTE DE ANEXO
                            values_aux['value_aux'] = JSON.stringify(obj_aux);                              
                        }

                        array_aux.push(values_aux);
                    });

                    setValues(array_aux);
                }

                // BLOQUEIA VALIDAÇÃO DO MICROSSISTEMA PARA QUE O USUÁRIO PREENCHA OS ITENS
                if(response?.data?.data?.loja?.row?.microssistema_id){
                    setMicrossistemaValidation(false);
                }

                // ATIVA MODAL CASO NÃO TENHA MICROSSISTEMA (SE TIVER MICROSSISTEMA O MODAL É HABILITADO SÓ DEPOIS DE CARREGAR OS ITENS DELE)
                if(!response?.data?.data?.loja?.row?.microssistema_id){
                    setActive(true);
                    document.body.style.overflow = 'hidden'; // DESABILITA SCROLL DA PÁGINA
                }
            }
        });
    },[]);

    // ENVIO DOS DADOS
    function submit(){
        let obj_aux = {
            id: id
        };

        // ACRESCENTA OS ITENS AO OBJETO DE ENVIO
        values.map((item, i) => {
            Object.assign(obj_aux, item);
        });

        // ACRESENTA OS USUÁRIOS AO OBJETO DE ENVIO
        Object.assign(obj_aux, {usuarios: validacaoUsuarios});
        Object.assign(obj_aux, {funcionarios: validacaoFuncionarios});

        setLoading(true);

        if(microssistema){
            axios({
                method: 'post',
                url: window.host+'/systems/microssistemas-novo/api/novo.php?do=post_microssistema',
                data: microssistemaValues,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then((response) => {
                if(response.data){
                    axios({
                        method: 'post',
                        url: window.host_madnezz+'/systems/integration-react/api/request.php',
                        params: {
                            type: 'Table',
                            do: 'setUpdateTable',
                            id_log: idLog,
                            id: id,
                            microssistema_id: response.data,
                            usuarios: validacaoUsuarios,
                            funcionarios: validacaoFuncionarios
                        },
                        data: values,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(() => {
                        setLoading(false);
                        setActive(false);
                        setValues(null);
                        toast('Dados atualizados com sucesso');            
                        document.body.style.overflow = 'auto'; // DESABILITA SCROLL DA PÁGINA
                    }).catch((error) => {
                        toast('Erro ao atualizar os dados, tente novamente');
                    });
                }
                
            });
        }else{
            axios({
                method: 'post',
                url: window.host_madnezz+'/systems/integration-react/api/request.php',
                params: {
                    type: 'Table',
                    do: 'setUpdateTable',
                    id_log: idLog,
                    id: id,
                },
                data: obj_aux,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(() => {
                setLoading(false);
                setActive(false);
                setValues(null);
                toast('Dados atualizados com sucesso');            
                document.body.style.overflow = 'auto'; // DESABILITA SCROLL DA PÁGINA
            }).catch((error) => {
                toast('Erro ao atualizar os dados, tente novamente');
            });
        }        
    }

    // ATUALIZAR MAIS TARDE
    function later(){
        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                do: 'setUpdateTableLog',
                type: 'Table'
            },
            data: {
                id: idLog,
                id_atualizacao_tabela: id,
                qtd_depois: qtd_depois + 1
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(() => {
            setActive(false);           
        }).catch((error) => {
            toast('Erro ao adiar, tente novamente');
        });
    }

    // DEFINE TITULO DO MODAL
    let title_aux;
    if(titulo){
        title_aux = titulo;
    }else{
        title_aux = 'Atualize '+(items?.length > 1 ? 'os dados' : ('o '+items[0]?.label))+' do seu empreendimento';
    }

    // DEFINE TEXTO DESCRITIVO DO MODAL
    let description_aux;
    if(descricao){
        description_aux = descricao;
    }else{
        description_aux = 'Para melhorar a sua experiência no sistema e manter os seus dados sempre atualizados, atualize '+(items.length > 1 ? 'os dados' : ('o '+items[0]?.label))+' do seu empreendimento!';
    }

    // CALLBACK DO MICROSSISTEMA
    const handleMicrossistemaCallback = (e) => {
        if(e?.loaded){
            setActive(true);
            document.body.style.overflow = 'hidden'; // DESABILITA SCROLL DA PÁGINA
        }else{        
            let data = [];
        
            if(e.values){
                setMicrossistemaValidation(e.validation);
                
                e.values.map((item, i) => {
                    data.push({
                    valor: item.value,
                    opcao_id: '',
                    secao_id: item.loja_id,
                    loja_id_aux: '',
                    item_id: item.id
                    });
                });
            } 
        
            setMicrossistemaValues({
                data: data,
                tipo: 'Loja',
                microssistema_id: microssistema,
                job_id: '',
                job_data: '',
                type_system: 'microssistemas'
            });
        }
    }

    // CALLBACK DA VALIDAÇÃO DE USUÁRIOS
    const handleUserValidation = (e) => {
        setValidacaoUsuarios(e?.validation);
    }

    // CALLBACK DA VALIDAÇÃO DE FUNCIONÁRIOS
    const handleFuncionariosValidation = (e) => {
        setValidacaoFuncionarios(e?.validation);
    }

    // VARIÁVEIS AUXILIARES PARA O BOTÃO DE ENVIO
    let tippy_aux, disabled_aux;

    if(usuarios.length > 0 && validacaoUsuarios === false){
        disabled_aux = false;
        tippy_aux = 'Confirme se todos usuários devem ou não permanecerem ativos';
    }else if(funcionarios.length > 0 && validacaoFuncionarios === false){
        disabled_aux = false;
        tippy_aux = 'Confirme se todos funcionários devem ou não permanecerem ativos';
    }else{
        if(!values && !microssistemaValidation){
            disabled_aux = false;
            tippy_aux = 'Nenhuma informação inserida';
        }else{
            disabled_aux = true;
            tippy_aux = '';
        }
    }    

    return(
        <>
            <div className={style.overlay + ' ' + (active ? style.active : '')}>
                <div className={style.container + ' ' + (active ? style.active : '')}>
                    <div className={style.box}>
                        <div className={style.left}>
                            <img src={motivo ? Woman : Man} className={style.man} />

                            {(logoEmp ?
                                <img src={window.upload+'/'+logoEmp} className={style.logo} />
                            :'')}
                        </div>

                        <div className={style.right}>
                            {(motivo ? 
                                <>
                                    <h1>Dados reprovados</h1>
                                    <p>Motivo: {motivo}</p>
                                </>
                            :
                                <>
                                    <h1>{title_aux}</h1>
                                    <p>{description_aux}</p>
                                </>
                            )}

                            {(qtd_depois < qtd_depois_permitida ? <p>Você pode adiar mais {qtd_depois_permitida - qtd_depois} {qtd_depois_permitida - qtd_depois==1?'vez':'vezes'}</p> : <p> Você não pode mais adiar </p>)}

                            {items?.map((item, i) => {
                                let accept_aux;
                                let icon_aux;
                                let style_aux;

                                if(item?.type === 'image'){
                                    accept_aux = '.png, .jpeg, .jpg, .pdf';
                                    icon_aux = 'picture';
                                    style_aux = style.input;
                                }else{
                                    style_aux = 'mb-2'
                                }

                                return(
                                    <Item
                                        key={'cadastro_item_'+i}
                                        item={item}
                                        accept={accept_aux}
                                        icon={icon_aux}
                                        style={style_aux}
                                        callback={handleSetValues}
                                    />
                                )
                            })}       

                            {(microssistema &&
                                <Microssistema
                                    id={microssistema}
                                    tipo="loja"
                                    loja_id={(window.rs_id_lja && window.rs_id_lja > 0 ? window.rs_id_lja : '')}
                                    className={'mt-4'}
                                    callback={handleMicrossistemaCallback}
                                />                   
                            )}

                            {(usuarios.length > 0 &&
                                <Usuarios
                                    items={usuarios}
                                    callback={handleUserValidation}
                                />    
                            )}

                            {(funcionarios.length > 0 &&
                                <div className='mt-3'>
                                    <Funcionarios
                                        items={funcionarios}
                                        callback={handleFuncionariosValidation}
                                    />    
                                </div>
                            )}

                            {(items?.filter((elem) => elem.name === 'logo').length > 0 ?
                                <p className={style.obs}>
                                    Clique para selecionar a imagem de logotipo do seu computador, preferencialmente com fundo transparente.
                                </p>
                            :'')}

                            <div className={style.actions}>
                                <Tippy
                                    disabled={disabled_aux}
                                    content={tippy_aux}
                                >
                                    <div>
                                        <button
                                            className={style.btn_primary + ' ' + (loading ? style.loading : '') + ' ' + (!disabled_aux ? style.disabled : '')}
                                            onClick={() => submit()}
                                        >
                                            {loading ?
                                                <>
                                                    <Loader /> Enviando informações
                                                </>
                                            :
                                                <>
                                                    <Icon type="aprovar" readonly title={false} /> Atualizar informações
                                                </>
                                            }                                    
                                        </button>
                                    </div>
                                </Tippy>

                                {/* BOTÃO DEPOIS DESATIVADO PARA ATUALIZAÇÃO DE LOGOTIPO DO CARREFOUR */}
                                {(id!=10 && (qtd_depois < qtd_depois_permitida)? 
                                    <button
                                        className={style.btn_secondary}
                                        onClick={() => later()}
                                    >
                                        <Icon type="calendar" readonly title={false} />
                                        Depois
                                    </button>
                                : '')}               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )    
}
