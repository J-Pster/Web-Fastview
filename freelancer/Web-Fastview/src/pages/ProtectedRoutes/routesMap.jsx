import React from "react";

// SISTEMAS
const Jobs =  React.lazy(() => import("../Jobs"));
const SolicitacaoAcesso =  React.lazy(() => import("../SolicitacaoAcesso"));
const Comunicados =  React.lazy(() => import("../Comunicados"));
const MicrossistemasLegado =  React.lazy(() => import("../MicrossistemasLegado"));
const Trade = React.lazy(() => import("../Trade"));
const Microssistemas = React.lazy(() => import("../Microssistemas"));
const ChecklistLaravel = React.lazy(()=> import("../ChecklistLaravel"));
const TradeLegado = React.lazy(() => import("../TradeLegado"));

export const RoutesMap = ({ sistema_id, id_apl, permission, pus }) => {
  var routesMapList;

  routesMapList = {
    186: <TradeLegado permission={permission} id_apl={id_apl} sistema_id={sistema_id} pus={pus} />,
    220: <MicrossistemasLegado permission={permission} id_apl={id_apl} sistema_id={sistema_id} pus={pus} />,
    229: <Trade permission={permission} id_apl={id_apl} sistema_id={sistema_id} pus={pus} />,
    241: <Microssistemas permission={permission} id_apl={id_apl} sistema_id={sistema_id} pus={pus} />,
    251: <Comunicados permission={permission} id_apl={id_apl} sistema_id={sistema_id} pus={pus} />,
    258: <Jobs permission={permission} id_apl={id_apl} sistema_id={sistema_id} pus={pus} />,
    263: <SolicitacaoAcesso permission={permission} id_apl={id_apl} sistema_id={sistema_id} pus={pus} />,
    265: <ChecklistLaravel permission={permission} chamados={true} id_apl={id_apl} sistema_id={sistema_id} pus={pus} />
  };

  const component = routesMapList[sistema_id];

  return  component;
};

