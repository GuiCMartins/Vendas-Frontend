import { VendasPorMes } from "app/models/dashboard";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { MESES } from 'app/util/meses'

export const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  const [chartData, setChartData] = useState({});

  const carregaDadosGrafico = () => {
    const labels = props.vendasPorMes?.map((vm) => MESES[vm.mes! - 1]);
    const valores = props.vendasPorMes?.map((vm) => vm.valor);
    
    const dadosDoGrafico = {
      labels: labels,
      datasets: [
        {
          label: "Valor mensal",
          backgroundColor: '#42A5F5',
          data: valores,
        },
      ],
    };

    setChartData(dadosDoGrafico);
  };

  useEffect(carregaDadosGrafico, []);

  const produtoCardStyle = {
    background: "red",
    color: "white",
  };

  const clienteCardStyle = {
    background: "blue",
    color: "white",
  };

  const vendaCardStyle = {
    background: "green",
    color: "white",
  };

  return (
    <div className="p-fluid">
      <div className="p-grid">
        <div className="p-col">
          <Card title="Produtos" style={produtoCardStyle}>
            <p className="p-m-0">{props.produtos}</p>
          </Card>
        </div>
        <div className="p-col">
          <Card title="Clientes" style={clienteCardStyle}>
            <p className="p-m-0">{props.clientes}</p>
          </Card>
        </div>
        <div className="p-col">
          <Card title="Vendas" style={vendaCardStyle}>
            <p className="p-m-0">{props.vendas}</p>
          </Card>
        </div>
      </div>

      <div className="p-grid">
        <div className="p-col">
          <Chart
            type="bar"
            data={chartData}
            style={{ position: "relative", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

interface DashboardProps {
  clientes?: number;
  vendas?: number;
  produtos?: number;
  vendasPorMes?: Array<VendasPorMes>;
}
