import Col from "../../../components/body/col";
import Row from "../../../components/body/row";
import Table from "../../../components/body/table";
import Thead from "../../../components/body/table/thead";
import Th from "../../../components/body/table/thead/th";
import Tr from "../../../components/body/table/tr";
import Title from "../../../components/body/title";

export default function Lista(){
    return(
        <>
            <Row>
                <Col>
                    <Title>Lista</Title>

                    <Table

                    >
                        <Thead>
                            <Tr>
                                <Th>
                                    ID
                                </Th>
                                <Th>
                                    Loja
                                </Th>
                                <Th>
                                    Data
                                </Th>
                                <Th>
                                    Respondido por
                                </Th>
                            </Tr>
                        </Thead>
                    </Table>
                </Col>
            </Row>
        </>
    )
}