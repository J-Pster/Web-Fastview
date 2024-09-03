import { useEffect, useState } from 'react';
import style from './Dashboard.module.scss';
import Title from "../title";
import Icon from '../icon';
import Row from '../row';
import Col from '../col';
import Table from '../table';
import Thead from '../table/thead';
import Tbody from '../table/tbody';
import Tr from '../table/tr';

export default function Dashboard(props){
    // ESTADOS
    const [expand, setExpand] = useState(false);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [loading3, setLoading3] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(() => {
        if(props.cols?.col_1){
            setLoading1(true);
        }
    },[props.cols?.col_1?.api?.url, props.cols?.col_1?.api?.params?.reload]);

    // CHAMA A API NOVAMENTE SEMPRE QUE CLICA NO ÍCONE PARA EXPANDIR AS COLUNAS
    useEffect(() => {
        props.cols?.col_2.callback([]);
        props.cols?.col_3.callback([]);

        if(expand){
            if(props.cols?.col_2){
                setLoading2(true);
            }

            if(props.cols?.col_3){
                setLoading3(true);
            }
        }else{
            props.cols?.col_2.callback([]);
            props.cols?.col_3.callback([]);
        }
    },[
        expand,
        props.cols?.col_2.api?.url,
        props.cols?.col_3.api?.url,
        props.cols?.col_2?.api?.params?.reload,
        props.cols?.col_3?.api?.params?.reload
    ]);

    // CONSTRÓI COL 1 
    const handleSetCol1 = (e) => {
        props.cols?.col_1.callback(e);
        setLoading1(false);
        setFirstLoad(false);
    }

    // CONSTRÓI COL 2
    const handleSetCol2 = (e) => {
        props.cols?.col_2.callback(e);
        setLoading2(false);
    }

    // CONSTRÓI COL 3 
    const handleSetCol3 = (e) => {
        props.cols?.col_3.callback(e);
        setLoading3(false);
    }

    // EXPANDE COLUNAS
    const handleExpand = () => {        
        setExpand(!expand);

        setTimeout(() => {
            if(expand){
                // AÇÕES AO FECHAR
            }else{
                // AÇÕES AO ABRIR
                let col1Width = document.getElementById('col1_'+props?.id).offsetWidth;
                let col2Width = document.getElementById('col1_'+props?.id).offsetWidth;
                let col3Width = document.getElementById('col1_'+props?.id).offsetWidth;
                let colPosition = document.getElementById('col3_'+props?.id).offsetLeft;

                document.getElementById('container').scrollLeft = (colPosition - col1Width - col2Width - col3Width + 190);
            }
        },0);
    }

    return(
        <>
            <Row>
                <Col id={'col1_'+props?.id}>
                    <div className={style.dashboard + ' dashboard_col'}>
                        <Title
                            icon={
                                <>
                                    {/* {(props.excel?<Icon type="excel" title="Exportar em Excel" />:<Icon type="excel" title="Exportador de excel não configurado" disabled={true} />)} */}
                                    {(props.cols?.col_2&&props.cols?.col_3?<Icon type="expandir" expanded={(expand?true:false)} title={(expand?'Minimizar':'Expandir')} onClick={handleExpand} />:<Icon type="expandir" title="API para expandir colunas não configurada" disabled={true} />)}
                                </>
                            }
                        >
                            {(props.cols.col_1.title ? props.cols.col_1.title : 'Dashboard')}
                        </Title>

                        <Table
                            id={'col1_'+props?.id}                       
                            api={props.cols?.col_1?.api?.url}
                            params={props.cols?.col_1?.api?.params}
                            limit={props?.cols?.col_1?.api?.params?.limit}
                            onLoad={handleSetCol1}
                            reload={props.cols?.col_1?.api?.url + props.cols?.col_1?.api?.params?.reload}
                            firstLoad={firstLoad}
                            key_aux={props?.cols?.col_1?.api?.key_aux}
                        >
                            <Thead>{props.thead}</Thead>
                            <Tbody>
                                {(!loading1 ? 
                                    props.cols.col_1.tbody
                                :
                                    <></>
                                )}    
                            </Tbody>
                        </Table>
                    </div>
                </Col>
            
                {(expand?
                    <>
                        <Col id={'col2_'+props?.id}>
                            <div className={style.dashboard + ' dashboard_col'}>
                                <Title
                                    icon={
                                        <>
                                            {/* {(props.excel?<Icon type="excel" title="Exportar em Excel" />:<Icon type="excel" title="Exportador de excel não configurado" disabled={true} />)} */}
                                        </>
                                    }
                                >
                                    {(props.cols.col_2.title ? props.cols.col_2.title : 'Dashboard')}
                                </Title>

                                <Table
                                    id={'col2_'+props?.id}                       
                                    api={props.cols?.col_2?.api?.url}
                                    params={props.cols?.col_2?.api?.params}
                                    limit={props?.cols?.col_2?.api?.params?.limit}
                                    onLoad={handleSetCol2}
                                    reload={props.cols?.col_2?.api?.url + props.cols?.col_2?.api?.params?.reload}
                                    key_aux={props?.cols?.col_2?.api?.key_aux}
                                >
                                    <Thead>{props.thead}</Thead>
                                    <Tbody>
                                        {(!loading2 ? 
                                            props.cols.col_2.tbody
                                        :
                                            <></>
                                        )}                                        
                                    </Tbody>
                                </Table>
                            </div>
                        </Col>

                        <Col id={'col3_'+props?.id}>
                            <div className={style.dashboard + ' dashboard_col'}>
                                <Title
                                    icon={
                                        <>
                                            {/* {(props.excel?<Icon type="excel" title="Exportar em Excel" />:<Icon type="excel" title="Exportador de excel não configurado" disabled={true} />)} */}
                                        </>
                                    }
                                >
                                    {(props.cols.col_3.title ? props.cols.col_3.title : 'Dashboard')}
                                </Title>

                                <Table
                                    id={'col3_'+props?.id}                       
                                    api={props.cols?.col_3?.api?.url}
                                    params={props.cols?.col_3?.api?.params}
                                    limit={props?.cols?.col_3?.api?.params?.limit}
                                    onLoad={handleSetCol3}
                                    reload={props.cols?.col_3?.api?.url + props.cols?.col_3?.api?.params?.reload}
                                    key_aux={props?.cols?.col_3?.api?.key_aux}
                                >
                                    <Thead>{props.thead}</Thead>
                                    <Tbody>
                                        {(!loading3 ? 
                                            props.cols.col_3.tbody
                                        :
                                            <></>
                                        )}                                        
                                    </Tbody>
                                </Table>
                            </div>
                        </Col>
                    </>
                :'')}
            </Row>
        </>
    )
}