import Col from "../../components/body/col";
import Container from "../../components/body/container";
import Row from "../../components/body/row";
import Password from "./Password";
import Photo from "./Photo";
import Template from "./Template";

export default function Settings(){
    return(
        <Container>
            <Row>
                <Col>
                    <Password />
                </Col>
                <Col>
                    <Photo />
                    <Template />
                </Col>
            </Row>            
        </Container>
    )
}
