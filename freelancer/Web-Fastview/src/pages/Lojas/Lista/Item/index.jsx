import style from './item.module.scss';

import Tr from "../../../../components/body/table/tr";
import Td from "../../../../components/body/table/tbody/td";
import Icon from "../../../../components/body/icon";
import { useContext, useState } from "react";
import { GlobalContext } from "../../../../context/Global";
import { downloadFile,get_date } from '../../../../_assets/js/global';
import toast from 'react-hot-toast';
import axios from 'axios';
import Input from '../../../../components/body/form/input';
import Modal from '../../../../components/body/modal';
import ModalHeader from '../../../../components/body/modal/modalHeader';
import ModalTitle from '../../../../components/body/modal/modalHeader/modalTitle';
import ModalBody from '../../../../components/body/modal/modalBody';
import Textarea from '../../../../components/body/form/textarea';
import Button from '../../../../components/body/button';

export default function Item({loja, format, callback, selected, limit}){
    // CONTEXT
    const { handleSetSources, handleSetToggler } = useContext(GlobalContext);
    
    // ESTADOS
    const [showModal, setShowModal] = useState(false);
    const [motivo, setMotivo] = useState('');
    const [loading, setLoading] = useState(false);

    // VISUALIZAR IMAGEM
    function view_image(id){
        handleSetToggler(true);
        handleSetSources([window.upload+'/'+id], 0);
    }

    // DELETAR LOG
    function handleReprovar(){
        setShowModal(true);        
    }

    // SUBMIT FORM
    const handleSubmit = (status) => {
        let validation_aux = false;

        if(status == 1){
            if(window.confirm('Confirma o preenchimento correto dos dados?')){  
                validation_aux = true;
            }else{
                validation_aux = false;
            }
        }else if(status == 2){
            if(window.confirm('Reprovar dados? A solicitação será reaberta para que o lojista preencha novamente.')){  
                validation_aux = true;
            }else{
                validation_aux = false;
            }
        }
        
        if(validation_aux){  
            setLoading(true);

            axios({
                method: 'post',
                url: window.host_madnezz+'/systems/integration-react/api/request.php',
                params: {
                    do: 'setUpdateTableLog',
                    type: 'Table'
                },
                data: {
                    id: loja?.id_att_log,
                    status: status,
                    motivo: motivo
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(() => {
                toast('Dados '+(status == 1 ? 'aprovados' : 'reprovados')+' com sucesso!');

                setLoading(false);
                setShowModal(false);
                setMotivo('');

                if(callback){
                    callback({
                        reload: true
                    })
                }
            }).catch(() => {
                toast('Erro ao '+(status == 1 ? 'aprovar' : 'reprovar')+' os dados');
                setLoading(false);
            });
        }
    }

    // VARIÁVEIS AUXILIARES DOS BOTÕES DE APROVAR E REPROVAR
    let aprovar_title = 'Aprovar';
    let aprovar_readonly = false;
    let aprovar_disabled = false;
    let aprovar_class = '';
    let reprovar_title = 'Reprovar';
    let reprovar_readonly = false;
    let reprovar_disabled = false;
    let reprovar_class = '';

    if(!loja.id_att_log){
        aprovar_title = 'Aprovar (Dados não confirmados pelo lojista)';
        aprovar_disabled = true;
        reprovar_title = 'Reprovar (Dados não confirmados pelo lojista)';
        reprovar_disabled = true;
    }else{
        if(loja.status_aprovacao == 1){
            aprovar_title = 'Aprovado';
            aprovar_readonly = true;
            aprovar_class = 'text-success';
            reprovar_title = false;
            reprovar_disabled = true;     
        }else if(loja.status_aprovacao == 2){
            reprovar_title = 'Reprovado (Aguardando reenvio do lojista)';
            reprovar_readonly = true;
            reprovar_class = 'text-danger';
            aprovar_title = false;
            aprovar_disabled = true;
        }
    }

    // SELECIONAR LOJA
    const handleSelected = (e) => {
        if(e.target.checked){
            callback({
                select: e.target.value
            });
        }else{
            callback({
                deselect: e.target.value
            });
        }
    }

    // VALOR DO STATUS
    let status_aux;

    if(loja?.status_aprovacao == 1){
        status_aux = 'Aprovado';
    }else if(loja?.status_aprovacao == 2){
        status_aux = 'Reprovado';
    }else if(loja?.status_aprovacao == 0){
        status_aux = 'Avaliar';
    }else{
        status_aux = 'Não atualizado';
    }
    
    return(
        <>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
            >
                <ModalHeader>
                    <ModalTitle>
                        <strong>Reprovar</strong> {(loja.nome ? ' - '+loja.nome : '')}
                    </ModalTitle>
                </ModalHeader>

                <ModalBody>
                    <Textarea
                        id="motivo"
                        name="motivo"
                        placeholder="Motivo"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="mb-3"
                    />

                    <Button
                        type="submit"
                        title={motivo.length == 0 ? 'Digite um motivo' : ''}
                        disabled={motivo.length == 0 ? true : false}
                        onClick={() => handleSubmit(2)}
                        status={loading ? 'loading' : ''}
                    >
                        Enviar
                    </Button>
                </ModalBody>
            </Modal>

            <Tr className={style.item}>
                <Td title={selected.length == limit && !selected.includes(loja.id) ? 'Só é possível selecionar '+limit+' lojas por vez' : ''}>
                    <Input
                        type="checkbox"
                        id={'loja_'+loja.id}
                        name={'loja_'+loja.id}
                        value={loja.id}
                        checked={selected.includes(loja.id) ? true : false}
                        disabled={selected.length == limit && !selected.includes(loja.id) ? true : false}                        
                        onChange={handleSelected}
                    />
                </Td>
            
                <Td disableView={false}>{loja.nome_emp}</Td>
                
                <Td disableView={false}>{loja.nome}</Td>

                {/* <Td>{loja.cnpj ? loja.cnpj : '-'}</Td> */}

                {/* <Td>{loja.contrato ? loja.contrato : '-'}</Td> */}

                {/* <Td>{loja.luc ? loja.luc : '-'}</Td> */}

                {/* <Td>{loja.localizacao ? loja.localizacao : '-'}</Td> */}

                <Td disableView={false}>{loja.email ? loja.email : '-'}</Td>

                <Td disableView={false}>{loja.data_atualizacao ? get_date('datetime',loja.data_atualizacao,'datetime_sql') : '-'}</Td>

                {/* <Td>{loja.telefone ? loja.telefone : '-'}</Td> */}

                <Td width={1} align="center">
                    {(format === 'list' ?
                        <Icon
                            type="view"
                            title={(loja.logo ? 'Visualizar' : 'Não cadastrado')}
                            disabled={(loja.logo ? false : true)}
                            onClick={() => view_image(loja.logo)}
                            animated
                        />
                    :
                        (loja.logo && <div className={style.image} style={{backgroundImage:'url('+window.upload+'/'+loja.logo+')'}} />)
                    )}
                </Td>

                <Td>
                    {status_aux}
                </Td>

                <Td width={1} align="center">
                    <Icon
                        type="download"
                        title="Baixar logo"
                        disabled={loja?.logo ? false : true}
                        onClick={() => downloadFile(loja?.logo, loja.nome)}
                        animated
                    />

                    <Icon
                        type={'check'}
                        animated={true}
                        title={aprovar_title}
                        disabled={aprovar_disabled}
                        readonly={aprovar_readonly}
                        className={aprovar_class}
                        loading={loading}
                        onClick={() => handleSubmit(1)}
                    />
                    
                    <Icon
                        type={'reprovar2'}
                        animated={true}
                        title={reprovar_title}
                        disabled={reprovar_disabled}
                        readonly={reprovar_readonly}
                        className={reprovar_class}
                        onClick={() => handleReprovar()}
                    />
                </Td>
            </Tr>
        </>
    )
}
