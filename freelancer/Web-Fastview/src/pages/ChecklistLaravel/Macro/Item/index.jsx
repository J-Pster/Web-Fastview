import { useState, useContext } from "react";
import Icon from "../../../../components/body/icon";
import Modal from "../../../../components/body/modal";
import ModalHeader from "../../../../components/body/modal/modalHeader";
import ModalTitle from "../../../../components/body/modal/modalHeader/modalTitle";
import ModalBody from "../../../../components/body/modal/modalBody";
import axios from "axios";
import { ChecklistContext } from "../../../../context/Checklist";
import Row from "../../../../components/body/row";
import Col from "../../../../components/body/col";
import Foto from '../../Lista/Cadastro/Item/Foto';

export default function Item(props){
    // ESTADOS
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);

    // ABRE MODAL
    const handleShowModal = () => {
        setShowModal(true);
    }

    // FECHA MODAL
    const handleCloseModal = () => {
        setShowModal(false);
        if(reload){
            props.callback(true);
        }else{
            props.callback(false);
        }
    }

    // RECARREGA LISTA APÓS AVALIAR ALGUMA FOTO
    function handleSetReload(){
        setReload(true);
    }

    return(
        <>
            <Icon
                type={props?.type}
                readonly={props?.readonly}
                className={props?.className}
                title={props?.title}
                onClick={() => handleShowModal()}
            />

            <Modal show={showModal} onHide={handleCloseModal} lg={true}>
                <ModalHeader>
                    <ModalTitle>{props?.modalTitle}</ModalTitle>
                </ModalHeader>
                <ModalBody>           
                    <Row>          
                        {props?.items?.map((item, i) => {
                            var json, imgModelo, imgTirada;

                            if(item.resposta_supervisao){
                                json = JSON.parse(item.resposta_supervisao);
                                imgModelo = [window.upload+'/'+json.foto_1[0]?.imagem];
                                imgTirada = [window.upload+'/'+json.foto_2[0]?.imagem];

                                if(json?.foto_2[1]){
                                    imgTirada.push(window.upload+'/'+json.foto_2[1]?.imagem);
                                }
                            }else{
                                json = '';

                                if(item?.modelos){
                                    let modelo_aux = [];
                                    item?.modelos?.map((img, i) => {
                                        modelo_aux.push(window.upload+'/'+img?.id);
                                    })
                                    imgModelo = modelo_aux;
                                }else{
                                    imgModelo = [];
                                }

                                imgTirada = [];
                            }

                            return(                                                          
                                <Col lg={6} key={item?.checklist_id+'_'+item?.pergunta_id} className="mb-4">
                                    <div>
                                        <Foto
                                            left={(imgModelo ? imgModelo : [])}
                                            right={(imgTirada ? imgTirada : '')}
                                            qtd={Array.isArray(imgTirada) ? imgTirada?.length : undefined}
                                            modelo={(item?.tipo_sistema == 'antes_depois' ? false : true)}
                                            rate={{
                                                lojista: (((item?.tipo_sistema == 'antes_depois' && imgModelo.length > 0 && imgTirada.length > 0) || (item?.tipo_sistema != 'antes_depois' && imgTirada.length > 0)) && (window.rs_permission_apl !== 'supervisor' && window.rs_permission_apl !== 'master') && item.double_check? true : false), // BOTÃO DE APROVAR/REPROVAR FOTO TIRADA APARECE SOMENTE PARA NÍVEL DE ACESSO LOJISTA
                                                adm: (item.resposta && item.resposta > 0 && item?.status_checklist == 1 && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'master') ? true : false) // BOTÃO DE APROVAR/REPROVAR AVALIAÇÃO DA FOTO TIRADA APARECE SÓ SE TIVER RESPOSTA E O NÍVEL DE ACESSO FOR MAIOR QUE LOJISTA
                                            }}                                                                    
                                            aproved={{
                                                lojista: (item.resposta == 1 ? true : false),
                                                adm: (item.double_check == 1 ? true : false)
                                            }}
                                            inapplicable={{
                                                lojista: (item.resposta == 3 ? true : false),
                                                adm: (item.double_check == 3 ? true : false)
                                            }}
                                            reproved={{
                                                lojista: (item.resposta == 2 ? true : false),
                                                adm: (item.double_check == 2 ? true : false)
                                            }}
                                            lojista={item?.resposta_usuario}
                                            adm={item?.double_check_usuario}
                                            title={(item.secao ? item.secao+': ':'') + item?.pergunta}
                                            observation={item?.resposta_observacao}
                                            avaliation={item?.double_check_motivo}
                                            avaliation_observation={item?.resposta_motivo}
                                            params={{
                                                pergunta_id: item?.pergunta_id,
                                                checklist_id: item?.checklist_id,
                                                loja_id: item?.loja_id,
                                                resposta_id: item?.resposta_id,
                                                resposta: item?.resposta
                                            }}
                                            date_lojista={item?.resposta_dataFormatada}
                                            date_adm={item?.double_check_dataFormatada}
                                            hover={false}
                                            callback={() => handleSetReload()}
                                        />                 
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                </ModalBody>
            </Modal>
        </>
    )
}