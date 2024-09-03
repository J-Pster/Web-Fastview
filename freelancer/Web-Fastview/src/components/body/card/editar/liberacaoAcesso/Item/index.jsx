import { useEffect, useState } from 'react';
import Input from '../../../../form/input';
import Select from '../../../../select';
import style from'../style.module.scss';
import Icon from '../../../../icon';
import { cd, get_date } from '../../../../../../_assets/js/global';
import Title from '../../../../title';

export default function Item({item, remove, callback, approval, readonly}){
    // ESTADOS
    const [nome, setNome] = useState(item?.values?.length > 0 ? item?.values?.filter(({nome}) => nome)[0]?.nome : '');
    const [tipoDocumento, setTipoDocumento] = useState(item?.values?.length > 0 ? item?.values?.filter(({tipo_documento}) => tipo_documento)[0]?.tipo_documento : 'cpf');
    const [documento, setDocumento] = useState(item?.values?.length > 0 ? item?.values?.filter(({documento}) => documento)[0]?.documento : '');
    const [inicio, setInicio] = useState(item?.values?.length > 0 ? new Date(item?.values?.filter(({inicio}) => inicio)[0]?.inicio+' 00:00:00') : '');
    const [fim, setFim] = useState(item?.values?.length > 0 ? new Date(item?.values?.filter(({fim}) => fim)[0]?.fim+' 00:00:00') : '');
    const [loja, setLoja] = useState(item?.values?.length > 0 ? item?.values?.filter(({loja}) => loja)[0]?.loja : (window.rs_id_lja > 0 ? window.rs_id_lja : ''));
    const [lojaNome, setLojaNome] = useState(item?.values?.length > 0 ? item?.values?.filter(({loja_nome}) => loja_nome)[0]?.loja_nome : '');
    const [email, setEmail] = useState(item?.values?.length > 0 ? item?.values?.filter(({email}) => email)[0]?.email : '');
    const [status, setStatus] = useState(item?.approved);
    const [firstLoad, setFirstLoad] = useState(true);
    
    // ESTADOS DE OPTIONS 
    const optionsDocumentos = [
        {id: 'cpf', nome: 'CPF'},
        {id: 'rg', nome: 'RG'}        
    ]

    // MÁSCARA DO DOCUMENTO
    let mask;
    if(tipoDocumento === 'cpf'){
        mask = '999.999.999-99';
    }else if(tipoDocumento === 'rg'){
        mask = '99.999.999-9';
    }

    // ZERA NÚMERO DO DOCUMENTO AO TROCAR O TIPO
    useEffect(() => {
        if(!firstLoad && !approval){
            setDocumento('');
        }
    },[tipoDocumento]);

    // REMOVER ITEM
    const handleRemove = () => {
        if(callback){
            callback({
                remove: item?.id
            });
        }
    }

    // VALORES
    const values = [
        {nome: nome},
        {tipo_documento: tipoDocumento},
        {documento: documento},
        {inicio: (inicio ? get_date('date_sql', cd(inicio)) : null)},
        {fim: (fim ? get_date('date_sql', cd(fim)) : null)},
        {loja: loja},
        {loja_nome: lojaNome },
        {email: email}
    ]

    // VERIFICA SE TODOS OS CAMPOS FORAM PREENCHIDOS PARA MANDAR A VALIDAÇÃO PRO COMPONENTE PAI
    useEffect(() => {
        if(!firstLoad){
            if(callback){
                if(nome && tipoDocumento && documento && inicio && fim && loja && email){
                    callback({
                        validation: {
                            id: item.id, values: values, status: true, approved: status
                        }
                    })
                }else{
                    callback({
                        validation: {
                            id: item.id, values: values, status: false, approved: status
                        }
                    })
                }
            }
        }
    },[nome, tipoDocumento, documento, inicio, fim, status, loja, email]);

    // TROCA STATUS
    const handleSetStatus = (value) => {
        setStatus(value);
    }

    // ATUALIZA ESTADO DE PRIMEIRO CARREGAMENTO
    useEffect(() => {
        setFirstLoad(false);
    },[firstLoad]);

    return(
        <div className={style.item}>
            <div className={style.form}>
                {(approval ? 
                    <Title
                        className={style.name}
                        icon={
                            (approval &&
                                <>
                                    <Icon
                                        type="times"
                                        title={readonly ? (status === '0' ? 'Reprovado' : false) : 'Reprovar'}
                                        className={style.btn_approval + ' ' + (status === '0' ? 'text-danger' : (status === null ? '' : 'text-secondary'))}
                                        readonly={readonly}
                                        onClick={() => (readonly ? {} : handleSetStatus('0'))}
                                        animated
                                    />

                                    <Icon
                                        type="check"
                                        title={readonly ? (status === '2' ? 'Aprovado' : false) : 'Aprovar'}
                                        className={style.btn_approval + ' ' + (status === '2' ? 'text-success' : (status === null ? '' : 'text-secondary'))}
                                        readonly={readonly}
                                        onClick={() => (readonly ? {} : handleSetStatus('2'))}
                                        animated
                                    />
                                </>    
                            )
                        }
                    >
                        {nome}
                    </Title>
                :
                    <Input
                        type="text"                
                        placeholder="Nome do prestador de serviço"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                )}

                {(approval ?
                    <div className={style.info_funcionario}>
                        {(lojaNome ? 
                            <p>{item?.values?.filter(({loja_nome}) => loja_nome)[0]?.loja_nome}</p>
                        :'')}
                        <p>{email}</p>
                        <p>CPF: {(tipoDocumento === 'cpf' ? documento : 'Não informado')}</p>
                    </div>
                :'')}

                {((!window.rs_id_lja || window.rs_id_lja == 0) && !approval &&
                    <Select
                        label="Loja"
                        api={{
                            url: window.host_madnezz+'/systems/integration-react/api/request.php?type=Job',
                            params: {
                                db_type: global.db_type,
                                do: 'getTable',
                                tables: [{
                                    table: 'store'
                                }]
                            },
                            key_aux: ['data', 'store']
                        }}
                        value={loja}
                        onChange={(e) => setLoja(e.value)}
                        allowEmpty={false}
                    />
                )}

                {(!approval &&
                    <Input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                )}

                <div className={style.documentos}>
                    {/* {(!approval &&
                        <Select
                            options={optionsDocumentos}
                            value={tipoDocumento}
                            onChange={(e) => setTipoDocumento(e.value)}
                            allowEmpty={false}
                            className={style.tipo}
                        />
                    )} */}

                    {(approval ?
                        <>
                            {/* <p className="mb-2 mb-lg-0">RG: {(tipoDocumento === 'rg' ? documento : 'Não informado')}</p>
                            <p className="mb-2 mb-lg-0">CPF: {(tipoDocumento === 'cpf' ? documento : 'Não informado')}</p> */}
                        </>
                    :
                        <Input
                            type="text"
                            mask={mask}
                            placeholder={'Nº do '+optionsDocumentos?.filter((elem) => elem.id === tipoDocumento)[0]?.nome}
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                            className={style.documento}
                        />
                    )}
                </div>

                <div className={style.datas}>
                    <Input
                        type="date"
                        label={false}
                        placeholder={'Liberar em'}
                        value={inicio}
                        readonly={readonly}
                        onChange={(e) => setInicio(e)}
                        className={style.documento}
                    />

                    <Input
                        type="date"
                        label={false}
                        placeholder={'Valido até'}
                        value={fim}
                        readonly={readonly}
                        onChange={(e) => setFim(e)}
                        className={style.documento}
                    />
                </div>
            </div>

            {(!approval &&
                <Icon
                    type="trash"
                    title={remove ? 'Excluir' : false}
                    disabled={remove ? false : true}
                    onClick={remove ? handleRemove : undefined}
                    animated
                />
            )}
        </div>        
    )
}