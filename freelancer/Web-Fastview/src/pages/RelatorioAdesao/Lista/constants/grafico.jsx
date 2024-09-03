import React from 'react'
import ChartCustom from "../../../../components/body/chart";
import useDashboardStore from './dashboard.store';

function AcessosEmpreendimentosComboChart() {
  const acessos_sistemas_empreendimentos = useDashboardStore((state) => state.acessos_sistemas_empreendimentos);
  return (
    <ChartCustom
      id="shopping_mais_acesso"
      title={`Shoppings com mais acesso`}
      type="ColumnChart"
      // headers={['Mês', 'Jobs no prazo', 'Chamados abertos', 'Comunicados enviados', 'Checklists conformes', 'Usuários ativos']}
      headers={["Sistemas", "Acessos"]}
      body={{
        type: "custom",
        content: [...acessos_sistemas_empreendimentos.combo.data],
      }}
      //height={(window.isMobile ? 400 : 553)}
      colors={["#ff9900"]}
      height={window.isMobile ? 450 : 600}
      fontSize={12}
      vAxis={{
        format: "short",
      }}
      hAxis={{
        slantedText: true,
      }}
      //loading={loadingMonth}
    />
  );
}

export default AcessosEmpreendimentosComboChart
  