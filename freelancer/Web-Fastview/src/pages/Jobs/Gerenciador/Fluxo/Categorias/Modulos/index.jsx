import SelectReact from '../../../../../../components/body/select';
import style from '../../style.module.scss';
import Table from '../../../../../../components/body/table';
import Tbody from '../../../../../../components/body/table/tbody';
import Tr from '../../../../../../components/body/table/tr';
import Td from '../../../../../../components/body/table/tbody/td';
import { useEffect, useState } from 'react';
import Icon from '../../../../../../components/body/icon';
import toast from 'react-hot-toast';
import { diffDays, get_date } from '../../../../../../_assets/js/global';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import Loader from '../../../../../../components/body/loader';

export default function Modulos({modulos, item, subcategoria, callback, actions, steps, usuarios, usuarios_modulos, collapse}){
    // ESTADOS
    const [usuariosAux, setUsuariosAux] = useState(usuarios);
    const [usuario, setUsuario] = useState('');
    const [modulo, setModulo] = useState(item?.id); 
    const [novoAux, setNovoAux] = useState(actions?.new);
    const [collapseAux, setCollapseAux] = useState(collapse);

    let id_leitura = (global.client=='fastview' ? 2836 : 440); 
    let id_sem_acesso = (global.client=='fastview' ? 2833 : 437); 
    let id_aprovador = (global.client=='fastview' ? 2837 : 441);

    // PERMISSÕES
    const permissions = [        
        {id: id_leitura, nome: 'Somente Leitura'},
        {id: id_sem_acesso, nome: 'Sem Acesso'},
        {id: id_aprovador, nome: 'Aprovador'}
    ]

    // ALTERA PERMISSÃO
    const handlePermissao = (id) => {
        const user_aux = [...usuariosAux];

        let permission_aux = permissions.findIndex((elem) => elem.id == user_aux[user_aux.findIndex((elem) => elem.id == id)].id_permissao) + 1;

        if(permission_aux >= permissions.length){
            permission_aux = permissions[0]?.id;
        }else{
            permission_aux = permissions[permissions.findIndex((elem) => elem.id == user_aux[user_aux.findIndex((elem) => elem.id == id)].id_permissao) + 1]?.id;
        }

        user_aux[user_aux.findIndex((elem) => elem.id == id)].id_permissao = permission_aux;
        setUsuariosAux(user_aux);

        if(permission_aux == id_sem_acesso){
            toast('Permissão alterada para "Sem acesso"');
        }else if(permission_aux == id_leitura){
            toast('Permissão alterada para "Apenas Leitura"');
        }else if(permission_aux == id_aprovador){
            toast('Permissão alterada para "Aprovador"');
        }        

        change_permission(id, usuarios?.filter((elem) => elem.id == id)[0]?.cfg_id_campos, permission_aux);
    }

    // REMOVE MÓDULO
    const handleRemoveModule = () => {
        if(window.confirm('Confirma a remoção do módulo das etapas de aprovação?')){
            if(callback){
                callback({
                    remove: item?.id
                });
            }

            axios({
                method: 'post',
                url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
                data: {
                    tables: [{
                        table: 'deleteSubcategoryModule',
                        filter: {
                            id_par: subcategoria?.id,
                            id_emp: window.rs_id_emp,
                            id_ite: steps[steps.length - 2]?.id ? steps[steps.length - 2]?.id : modulo,
                            id_ite_ite: steps[steps.length - 2]?.id ? modulo : undefined
                        }
                    }]
                },
                headers: { "Content-Type": "multipart/form-data" }
            });
        }
    }

    // ADICIONA MÓDULO
    const handleAddModule = () => {
        setNovoAux(false);

        if(callback){
            callback({
                include: modulo
            });
        }

        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job&do=setTable',
            data: {
                tables: [{
                    table: 'subcategoryModule',
                    filter: {
                        id_par: subcategoria?.id,
                        id_emp: window.rs_id_emp,
                        id_ite: steps[steps.length - 2]?.id ? steps[steps.length - 2]?.id : modulo,
                        id_ite_ite: steps[steps.length - 2]?.id ? modulo : undefined
                    }
                }]
            },
            headers: { "Content-Type": "multipart/form-data" }
        });
    }

    // FUNÇÃO QUE MUDA PERMISSÃO DO OPERADOR NO MÓDULO
    function change_permission(id, id_cfg, id_permissao = id_aprovador){ // PERMISSAO PADRÃO id_aprovador (SUPERVISOR)
        axios({
            method: 'post',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                type: 'Job',
                do: 'setTable'
            },
            data: {
                tables: [{
                    table: 'userModules',
                    filter: {
                        cfg_id_campos: id_cfg,
                        id_usr: id,
                        id_cfg_classe: 7,
                        id_apl: 224,
                        id_ite: modulo,
                        id_cfg_status: 1,
                        id_emp: window.rs_id_emp,
                        id_aux: id_permissao
                    }
                }]
            },
            headers: { "Content-Type": "multipart/form-data" }
        }).then(() => {
            // MANDA CALLBACK PRO COMPONENTE PAI PARA RECARREGAR A LISTA DE USUÁRIOS DO MÓDULO
            if(callback){
                callback({
                    includeUser: {
                        id_modulo: modulo
                    }
                })
            }
        });
    }

    // ADICIONA USUÁRIO
    const handleSetUsuario = (e) => {
        if(usuariosAux.filter((elem) => elem.id == e?.id).length > 0){
            toast('O usuário já faz parte do fluxo');
        }else{
            change_permission(e?.id);
            setUsuariosAux(usuariosAux => [...usuariosAux, ...[{id: e?.id, nome: e?.nome, id_permissao: id_aprovador, ultimo_acesso: get_date('date_sql', new Date(), 'new_date')}]]);
        }
    }

    // ATUALIZA ESTADO SEMPRE QUE SOFRER ALTERAÇÃO NA PROPS
    useEffect(() => {
        setUsuariosAux(usuarios);
    },[usuarios]);

    // ATUALIZA ESTADO SEMPRE QUE SOFRER ALTERAÇÃO NA PROPS
    useEffect(() => {
        setCollapseAux(collapse);
    },[collapse]);

    // ATUALIZA LISTA DE USUÁRIOS QUANDO O USUÁRIO TROCA O MÓDULO
    useEffect(() => {
        if(modulo){
            let array_aux = usuarios_modulos?.filter((elem) => elem.id_modulo == modulo)[0]?.ids_nomes_usuarios_acesso_modulo;

            if(array_aux){
                setUsuariosAux(usuarios_modulos?.filter((elem) => elem.id_modulo == modulo)[0]?.ids_nomes_usuarios_acesso_modulo);
            }else{
                if(usuarios){
                    setUsuariosAux([]);
                }else{
                    setUsuariosAux(null);
                }
            }
        }
    },[modulo]);

    return(
        <div className={style.modulo_container}>
            <div
                className={style.select_module + ' ' + (collapseAux ? style.collapsed : '')}
                style={!novoAux && !collapseAux && steps[steps.length - 1]?.id != item?.id ? {paddingRight: 5} : {}}
                onClick={() => (collapseAux ? setCollapseAux(false) : {})}
            >
                {(novoAux ?
                    <SelectReact
                        name="modulos"
                        id="modulos"
                        placeholder="Módulo"
                        allowEmpty={false}
                        options={modulos}
                        value={modulo}
                        onChange={(e) => setModulo(e.value)}
                    />
                :
                    <div className={style.name_module}>
                        {modulos?.filter((elem) => elem?.id == modulo)[0]?.nome}
                    </div>
                )}

                <div className={style.actions}>
                    {(collapseAux && !novoAux ?
                        <p className="mb-0">
                            ({usuariosAux?.length})
                        </p>
                    :
                        (actions?.delete && item?.id !== null ?
                            <div className={style.remove_module}>
                                <Icon
                                    type="trash"
                                    onClick={handleRemoveModule}                
                                    animated
                                />
                            </div>
                        :'')
                    )}

                    {(novoAux ?
                        <div className={style.confirm_module}>
                            <Icon
                                type="check"
                                onClick={handleAddModule}  
                                title={'Confirmar módulo no fluxo'}              
                                animated
                            />
                        </div>
                    :'')}
                </div>
            </div>

            {(!novoAux && !collapseAux ?
                <div className={style.search}>
                    <SelectReact
                        name="usuarios"
                        id="usuarios"
                        placeholder="Usuários"
                        allowEmpty={false}
                        api={{
                            url: window.host+"/systems/integration-react/api/request.php?type=Job",
                            params: {
                                db_type: global.db_type,
                                do: 'getTable',
                                tables: [{
                                    table: 'user',
                                    filter: {
                                        limit: {limit: 10000},
                                        id_sistema: window.rs_sistema_id,
                                        filter_lojista: true,
                                        permission: false,
                                        not_grupo: 1
                                    }
                                }]
                            },
                            key_aux: ['data', 'user']
                        }}
                        value={usuario}
                        onChange={(e) => handleSetUsuario(e)}
                    />                    
                </div>
            :'')}

            {(!collapseAux &&
                <Table text_limit={false}>
                    <Tbody>
                        {(usuariosAux ?                         
                            usuariosAux?.map((item, i) => {
                                let date_now = get_date('date_sql', new Date(), 'new_date');
                                let date_user = item?.sessao_data?.slice(0,10);
                                let dias_sem_acesso = diffDays(date_now, date_user);
                                let color_aux, tippy_aux, icon_aux, title_aux, class_aux;

                                if(dias_sem_acesso < 7){
                                    color_aux = '#ddd';
                                    tippy_aux = 'Usuário acessou o sistema recentemente';
                                }

                                if(dias_sem_acesso >= 7 && dias_sem_acesso <= 30){
                                    color_aux = 'rgba(var(--bs-warning-rgb)';
                                    tippy_aux = 'Usuário não acessa o sistema a mais de 7 dias';
                                }

                                if(dias_sem_acesso > 30){
                                    color_aux = 'rgba(var(--bs-danger-rgb)';
                                    tippy_aux = 'Usuário não acessa o sistema a mais de 30 dias';
                                }

                                if(item?.id_permissao == id_sem_acesso){
                                    icon_aux = 'times';
                                    title_aux = 'Sem acesso';
                                    class_aux = 'text-danger';
                                }else if(item?.id_permissao == id_leitura){
                                    icon_aux = 'view';
                                    title_aux = 'Somente Leitura';
                                    class_aux = '';
                                }else if(item?.id_permissao == id_aprovador){
                                    icon_aux = 'check';
                                    title_aux = 'Aprovador';
                                    class_aux = 'text-success';
                                }

                                return(
                                    <Tr key={'usuario_'+item?.id}>
                                        <Td disableView={false}>
                                            <div className={style.td_container}>
                                                <div className={style.user_container}>
                                                    <div className={style.user_name}>
                                                        {item?.nome}
                                                    </div>

                                                    <Tippy content={tippy_aux}>
                                                        <div
                                                            className={style.user_log}
                                                            style={{background: color_aux}}
                                                        ></div>
                                                    </Tippy>
                                                </div>

                                                <div>
                                                    <Icon
                                                        type={icon_aux}
                                                        title={title_aux}
                                                        className={class_aux}
                                                        onClick={() => handlePermissao(item?.id)}
                                                        animated
                                                    />
                                                    {/* <Icon
                                                        type="trash"
                                                        title="Remover usuário"
                                                        onClick={() => handleRemoveUser(item?.id)}
                                                        animated
                                                    /> */}
                                                </div>
                                            </div>                                    
                                        </Td>
                                    </Tr>
                                )
                                    
                            })
                        :
                            <Tr>
                                <Td colspan="100%" align="center">
                                    <Loader />
                                </Td>
                            </Tr>
                        )}                    
                    </Tbody>    
                </Table>
            )}
        </div>
    )
}