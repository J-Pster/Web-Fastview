import React from 'react'
import Tr from '../../../components/body/table/tr'
import Td from '../../../components/body/table/tbody/td';
import Icon from '../../../components/body/icon';
import { format } from 'date-fns';
import { cdh } from '../../../_assets/js/global';

const SupervisaoItem = ({
  id,
  status_adm,
  show,
  data_loja,
  imagem,
  status_loja,
  data_adm,
  job_id,
job_status_id,
  status_adm_nome,
  itemData,
  handleAdmResponse,
  handleShowMotivo,
  handleClick,
  hide
}) => {

    var color;

    if (status_adm_nome == "Avaliar") {
      color = "#0090d9";
    } else if (status_adm_nome == "Checar") {
      color = "gray";
    } else if (status_adm_nome == "Aprovado") {
      color = "green";
    } else if (status_adm_nome == "Reprovado") {
      color = "red";
    }

  return (
    <Tr key={id}>
      <Td disableView={false} title={"supervisao"} className="ps-5"></Td>
      <Td disableView={false} title={itemData.grupo}>
        {itemData.grupo ? itemData.grupo : "-"}
      </Td>
      <Td disableView={false} title={itemData.filial}>
        {itemData.filial}
      </Td>
      <Td disableView={false} title={itemData.industria}>
        {itemData.industria}
      </Td>
      <Td disableView={false} title={itemData.produto}>
        {itemData.produto}
      </Td>
      <Td disableView={false} title={cdh(data_loja)}>
        {cdh(data_loja)}
      </Td>
      <Td hide={hide} >-</Td>
      <Td hide={hide}>-</Td>
      <Td hide={hide}>-</Td>
      <Td hide={hide} align={'center'}>-</Td>
      <Td hide={hide} align={'center'}>-</Td>
      <Td hide={hide} align={'center'}>-</Td>
      <Td disableView={false} title={"supervisao"} >-</Td>
      <Td disableView={false} title={cdh(data_adm)}>
        {data_adm != null ? cdh(data_adm) : ""}
      </Td>
      <Td disableView={false} title={""}>
        <Icon
          type="view"
          animated
          disabled={!(imagem && status_loja == 2)}
          onClick={() => handleClick(`${window.upload}/${imagem}`)}
        />
      </Td>
      <Td disableView={false} align="center">
        <Icon
          type="check"
          title={"Aprovar"}
          disabled={![3, 4].includes(status_adm)}
          className={"text-success"}
          onClick={() =>
            handleAdmResponse({
              trade_id: itemData.id,
              status: 4,
              trade_supervisao_id: id,
              job_id,
              job_status_id,
            })
          }
        />
        <Icon
          type="reprovar2"
          title={"Reprovar"}
          disabled={![3, 5].includes(status_adm)}
          className={"text-danger"}
          onClick={() =>
            handleShowMotivo({
              checker: "adm",
              status: 5,
              trade_supervisao_id: id,
              job_id,
              job_status_id,
              trade_id: itemData.id,
            })
          }
        />
        {/* <Icon
              type="alert-circle"
              title={"Não se aplica"}
              disabled={
                status_loja == 1 || status_loja === null
                  ? false
                  : status_loja != 4
              }
              className={"text-warning"}
              onClick={() => handleShowMotivo("loja", 4, loja_img_aux)}
            /> */}
      </Td>
      <Td disableView={false}>
        <span className="trade-background" style={{ backgroundColor: color }}>
          {/* {props?.status_adm_nome?.split(',')[0]} */}
          {status_adm_nome}
        </span>
      </Td>
    </Tr>
  );
};

export default SupervisaoItem