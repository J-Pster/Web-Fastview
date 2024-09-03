import { useState, useContext } from "react";
import Td from "../../../components/body/table/tbody/td";
import Tr from "../../../components/body/table/tr";
import Icon from "../../../components/body/icon";
import Input from "../../../components/body/form/input";
import { cd, cdh, get_date } from "../../../_assets/js/global";
import Historico from "../Historico";
import axios from "axios";
import toast from "react-hot-toast";
import ModalMotivo from "./modalMotivo";
// import { GlobalContext } from "../../../context/Global";
import { GlobalContext } from "../../../context/Global";

export default function Item2(
    {
        id,
        contrato,
        grupo,
        filial,
        industria,
        produto,
        data_inicio,
        data_fim,
        job,
        job_categoria,
        job_subcategoria,
        job_status,
        observacao,
        valor,
        num_ponto,
        cod_fornecedor,
        cod_fase,
        modelo,
        check_loja,
        data_finalizada,
        check_adm,
        status,
        loja_imagem,
        trade_produto_descricao,

        status_adm,

        hide,
        color,
        reload,
        doReload,
        handleShow
    }
) {

    // CONTEXT
    const { handleSetSources, handleSetToggler } = useContext(GlobalContext);

    //DATA DE HOJE
    const date_now = new Date();
    //ADICIONAR ANEXO PELA TABELA
    const [anexo, setAnexo] = useState();
    const [show, setShow] = useState(false);
    const [checker, setChecker] = useState();
    const [imagem, setImagem] = useState();
    const [statusAux, setStatusAux] = useState();
    const [historico, setHistorico] = useState(false);

    //ABRIR MODAL MOTIVO
    const handleShowMotivo = (checker, status) => {
        if (!anexo && !loja_imagem) {
            alert("Cadastre uma imagem para continuar")
        } else {
            setShow(true),
                setChecker(checker),
                setStatusAux(status)
        }
    };
    //FECHAR MODAL MOTIVO
    const onHide = (response) => setShow(response);

    // PEGAR ANEXO APÓS UPLOAD
    const handleSetAnexo = (response, id) => {
        let string_aux;
        JSON.parse(response[0]).map((item, i) => {
            string_aux = item.id;
        });
        setAnexo(response[0]);
        setImagem(string_aux);
        axios({
            method: 'post',
            //url: (checker === 'loja' ? `${window.backend}/api/v1/trades/supervisao/lojas` : `${window.backend}/api/v1/trades/supervisao`),
            url: (`${window.backend}/api/v1/trades/supervisao/lojas`),
            data: {
                trade_id: id,
                status: null,
                motivo: null,
                imagem: string_aux
            },
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(() => {
            doReload(reload);
            toast('Imagem cadastrada com sucesso');
        }).catch((_error) => {
            toast('Ocorreu um erro, tente novamente');
        })
    }

    //'EXCLUIR' FOTO
    function excluirFoto() {
        if (window.confirm("Deseja excluir esse modelo?")) {
            axios({
                url: `${window.backend}/api/v1/trades/supervisao/lojas`,
                method: 'post',
                data: {
                    trade_id: id,
                    status: 2,
                    motivo: "Apagar foto",
                    imagem: null
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(() => {
                toast("Modelo excluído com sucesso");
                doReload(reload);
            }).catch((_error) => { toast("Ocorreu um erro, tente novamente") });
        }
    }

    //MOSTRAR IMAGEM
    const handleClick = (img) => {
        handleSetToggler(true);
        handleSetSources([img], 0)
    }

    return (
        <>
            <ModalMotivo
                show={show}
                onHide={onHide}
                imagem={imagem}
                status={statusAux}
                trade_id={id}
                checker={checker}
            />
            <Tr key={id}>
                <Td>
                    {/* 1 {props?.numerocontrato} */}
                    {contrato}
                </Td>
                <Td title={grupo}>
                    {/* 2 {props?.grupo} */}
                    {grupo}
                </Td>
                <Td title={filial}>
                    {/* 3 {props?.filial} */}
                    {filial}
                </Td>
                <Td title={industria}>
                    {/* {props?.nomefantasiafornecedor} */}
                    {industria}
                </Td>
                <Td title={produto}>
                    {/* 5 {props?.descricaoprodutotrade} */}
                    {produto}
                </Td>
                <Td title={`${cd(data_inicio)} a ${cd(data_fim)}`}>
                    {/* {props?.data_contrato} */}
                    {`${cd(data_inicio)} a ${cd(data_fim)}`}
                </Td>
                <Td hide={hide}>
                    {/* {props?.job} */}
                    {job}
                </Td>
                <Td hide={hide} align="center">
                    {/* {props?.job_categoria} */}
                    {job_categoria}
                </Td>
                <Td hide={hide} align="center">
                    {/* {props?.job_subcategoria} */}
                    {job_subcategoria}
                </Td>
                <Td hide={hide}>
                    {/* {props?.job_status} */}
                    {job_status}
                </Td>
                <Td hide={hide} title={observacao}>
                    {/* {props?.obs} */}
                    {observacao}
                </Td>
                <Td hide={hide}>
                    {/* {props?.valor} */}
                    {valor}
                </Td>
                <Td hide={hide}>
                    {/* {props?.numeroponto} */}
                    {num_ponto}
                </Td>
                <Td hide={hide} align="center">
                    {/* {props?.codigofornecedor} */}
                    {cod_fornecedor}
                </Td>
                <Td hide={hide} align="center">
                    {/* {props?.codigoprodutotrade} */}
                    {cod_fase}
                </Td>
                <Td hide={hide} align="center">
                    {/* {props?.numerofase} */}
                    {/* {modelo} */}
                </Td>
                <Td >
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {/* {
                            status !== 'Aprovado' &&
                            <Input
                                size="lg"
                                type="file"
                                border={false}
                                multiple={false}
                                className={'mx-0'}
                                value={anexo}
                                multipleValues={true}
                                callback={(e) => handleSetAnexo(e, id)}
                                input={(true)}
                                animated
                            //readonly={(props.interaction === false ? true : false)}
                            />
                        } */}
                        {
                            //loja_imagem &&
                            <div className="d-flex align-items-center">
                                <Icon
                                    type="view"
                                    animated
                                    //onClick={() => props.handleShow(loja_modelo, trade_produto_descricao)}
                                    onClick={() => handleClick(loja_imagem)}
                                />
                                {/* <div className="mini-delete-btn-trade">
                                    <Icon
                                        type="reprovar"
                                        title="Remover modelo"
                                        //  size={{editWidth: '10px', editHeight: '10px'}}
                                        onClick={() => excluirFoto()}
                                    //animated
                                    />
                                </div> */}
                            </div>
                            // props?.imagem_aux.map((item) => {
                            //     return (
                            //         <div className="d-flex align-items-center">
                            //             <Icon
                            //                 type="view"
                            //                 onClick={() => props.handleShow(item, props?.descricaoprodutotrade)}
                            //                 disabled={props?.imgmodelo ? false : true}
                            //                 animated
                            //             />
                            //             <div className="mini-delete-btn-trade">
                            //                 <Icon
                            //                     type="reprovar"
                            //                     title="Remover modelo"
                            //                     //  size={{editWidth: '10px', editHeight: '10px'}}
                            //                     onClick={() => excluirFoto(props?.trade_id, item)}
                            //                     //animated
                            //                 />
                            //             </div>
                            //         </div>
                            //     )
                            // })
                        }
                    </div>
                </Td>
                <Td >
                    {data_finalizada && cdh(data_finalizada)}
                    {/* {props?.data_foto_loja ? cd(props?.data_foto_loja?.slice(0, 10)) : ' - '} */}
                </Td>
                <Td align="center">
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {
                            !window.rs_id_lja &&
                            //window.rs_id_lja && -> trocar -> só pra lojista
                            <Input
                                size="lg"
                                type="file"
                                border={false}
                                multiple={false}
                                className={'mx-0'}
                                value={anexo}
                                multipleValues={true}
                                callback={(e) => handleSetAnexo(e, id)}
                                input={(true)}
                                animated
                            //readonly={(props.interaction === false ? true : false)}
                            />
                        }

                        <Icon
                            type="check"
                            title={"Aprovar"}
                            //disabled={!anexo ? true : false}
                            className={'text-success'}
                            onClick={() => handleShowMotivo('loja', 2)}
                        />
                        <Icon
                            type="reprovar2"
                            title={"Reprovar"}
                            // disabled={!anexo ? true : false}
                            className={'text-danger'}
                            onClick={() => handleShowMotivo('loja', 3)}
                        />
                        <Icon
                            type="alert-circle"
                            title={"Não se aplica"}
                            //disabled={!anexo ? true : false}
                            className={'text-warning'}
                            onClick={() => handleShowMotivo('loja', 4)}
                        />
                        <Historico
                            id={id}
                            contrato={contrato}
                            loja={filial}
                            grupo={grupo}
                            data={data_inicio}
                        />

                        {/* {(
                        job_status === "Concluído" ?

                            <>
                                <Icon
                                    type="view"
                                    //onClick={() => handleShow(props?.img_loja, props?.descricaoprodutotrade)}
                                    //disabled={props?.img_loja ? false : true}
                                    animated
                                />
                            </>
                            :
                            <Icon
                                type="view"
                                disabled={true}
                                animated
                            />
                    )} */}
                        <Icon
                            type="view"
                            animated
                            //onClick={() => props.handleShow(loja_modelo, trade_produto_descricao)}
                            onClick={() => handleClick(loja_imagem)}
                        />
                        {(
                            job_status === "Concluído" ?
                                <Icon
                                    type="aprovar"
                                    className="text-success"
                                />
                                : " "
                        )}
                    </div>
                </Td>
                {/* <Td>
                    <Icon
                        type="check"
                        title={"Aprovar"}
                        //disabled={!anexo ? true : false}
                        className={'text-success'}
                        onClick={() => handleShowMotivo('loja', 2)}
                    />
                    <Icon
                        type="reprovar2"
                        title={"Reprovar"}
                        // disabled={!anexo ? true : false}
                        className={'text-danger'}
                        onClick={() => handleShowMotivo('loja', 3)}
                    />
                    <Icon
                        type="alert-circle"
                        title={ "Não se aplica"}
                        //disabled={!anexo ? true : false}
                        className={'text-warning'}
                        onClick={() => handleShowMotivo('loja', 4)}
                    />
                    <Historico
                        id={id}
                        contrato={contrato}
                        loja={filial}
                        grupo={grupo}
                        data={data_inicio}
                    />
                </Td> */}

                <Td>
                    {status_adm}
                    {
                        status_adm === '1' || status_adm === '4' ?
                            <Icon
                                type="check"
                                title="Aprovar"
                                disabled={window.rs_id_lja}
                                className={status_adm === '4' ? 'disabled' : 'text-success'}
                                onClick={() => handleShowMotivo('', 4)}
                            />
                            : <></>
                    }
                    {
                        status_adm === '1' || status_adm === '5' ?
                            <Icon
                                type="reprovar2"
                                title="Reprovar"
                                disabled={window.rs_id_lja}
                                className={status_adm === '5' ? 'disabled' : 'text-danger'}
                                onClick={() => handleShowMotivo('', 5)}
                            />
                            : <></>
                    }

                    <Historico
                        id={id}
                        contrato={contrato}
                        loja={filial}
                        grupo={grupo}
                        data={data_inicio}
                    />
                </Td>
                <Td>
                    <span className="trade-background" style={{ backgroundColor: color }}>
                        {/* {props?.status_adm_nome?.split(',')[0]} */}
                        {status}
                    </span>
                </Td>
            </Tr>
        </>
    )
}