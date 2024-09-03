import { useEffect, useState } from 'react';
import style from './Dashboard.module.scss';
import Title from "../title";
import Icon from '../icon';
import Row from '../row';
import Col from '../col';
import axios from 'axios';
import Table from '../table';
import Thead from '../table/thead';
import Tbody from '../table/tbody';
import Tr from '../table/tr';
import Td from '../table/tbody/td';
import Loader from '../loader';

export default function Dashboard(props) {
    const [expand, setExpand] = useState(false);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [loading3, setLoading3] = useState(true);

    useEffect(() => {
        if (props.cols?.col_1) {
            setLoading1(true);

            axios({
                method: 'get',
                url: props.cols?.col_1?.api?.url,
                params: (props.cols.col_1.api.params ? props.cols.col_1.api.params : '')
            }).then((response) => {
                if (response.data) {
                    props.cols?.col_1.callback(response.data);
                }
                setLoading1(false);
            });
        }
    }, [props.cols?.col_1?.api?.url, props.cols?.col_1?.api?.params?.reload]);

    // CHAMA A API NOVAMENTE SEMPRE QUE CLICA NO ÍCONE PARA EXPANDIR AS COLUNAS
    useEffect(() => {
        props.cols?.col_2.callback([]);
        props.cols?.col_3.callback([]);

        if (expand) {
            if (props.cols?.col_2) {
                setLoading2(true);

                axios({
                    method: 'get',
                    url: props.cols?.col_2?.api?.url,
                    params: (props.cols.col_2.api.params ? props.cols.col_2.api.params : '')
                }).then((response) => {
                    if (response.data) {
                        props.cols?.col_2.callback(response.data);
                    }
                    setLoading2(false);
                });
            }

            if (props.cols?.col_3) {
                setLoading3(true);

                axios({
                    method: 'get',
                    url: props.cols?.col_3?.api?.url,
                    params: (props.cols.col_3.api.params ? props.cols.col_3.api.params : '')
                }).then((response) => {
                    if (response.data) {
                        props.cols?.col_3.callback(response.data);
                    }
                    setLoading3(false);
                });
            }
        } else {
            props.cols?.col_2.callback([]);
            props.cols?.col_3.callback([]);
        }
    }, [
        expand,
        props.cols?.col_2.api?.url,
        props.cols?.col_3.api?.url,
        props.cols?.col_2?.api?.params?.reload,
        props.cols?.col_3?.api?.params?.reload
    ]);

    

    return (
        <>
            <Row>
                <Col>
                    <div className={style.dashboard}>
                        <Title
                            icon={
                                <>
                                    {/* {(props.excel?<Icon type="excel" title="Exportar em Excel" />:<Icon type="excel" title="Exportador de excel não configurado" disabled={true} />)} */}
                                    {(props.cols?.col_2 && props.cols?.col_3 ? <Icon type="expandir" expanded={(expand ? true : false)} title="Exportar em Excel" onClick={() => setExpand(!expand)} /> : <Icon type="expandir" title="API para expandir colunas não configurada" disabled={true} />)}
                                </>
                            }
                        >
                            {(props.cols.col_1.title ? props.cols.col_1.title : 'Dashboard')}
                        </Title>

                        <Table>
                            <Thead>{props.thead}</Thead>
                            <Tbody>
                                {(!loading1 ?
                                    props.cols.col_1.tbody
                                    :
                                    <Tr>
                                        <Td colspan="100%">
                                            <Loader show={true} />
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </div>
                </Col>

                {(expand ?
                    <>
                        <Col>
                            <div className={style.dashboard}>
                                <Title
                                    icon={
                                        <>
                                            {/* {(props.excel?<Icon type="excel" title="Exportar em Excel" />:<Icon type="excel" title="Exportador de excel não configurado" disabled={true} />)} */}
                                        </>
                                    }
                                >
                                    {(props.cols.col_2.title ? props.cols.col_2.title : 'Dashboard')}
                                </Title>

                                <Table>
                                    <Thead>{props.thead}</Thead>
                                    <Tbody>
                                        {(!loading2 ?
                                            props.cols.col_2.tbody
                                            :
                                            <Tr>
                                                <Td colspan="100%">
                                                    <Loader show={true} />
                                                </Td>
                                            </Tr>
                                        )}
                                    </Tbody>
                                </Table>
                            </div>
                        </Col>

                        <Col>
                            <div className={style.dashboard}>
                                <Title
                                    icon={
                                        <>
                                            {/* {(props.excel?<Icon type="excel" title="Exportar em Excel" />:<Icon type="excel" title="Exportador de excel não configurado" disabled={true} />)} */}
                                        </>
                                    }
                                >
                                    {(props.cols.col_3.title ? props.cols.col_3.title : 'Dashboard')}
                                </Title>

                                <Table>
                                    <Thead>{props.thead}</Thead>
                                    <Tbody>
                                        {(!loading3 ?
                                            props.cols.col_3.tbody
                                            :
                                            <Tr>
                                                <Td colspan="100%">
                                                    <Loader show={true} />
                                                </Td>
                                            </Tr>
                                        )}
                                    </Tbody>
                                </Table>
                            </div>
                        </Col>
                    </>
                    : '')}
            </Row>
        </>
    )
}