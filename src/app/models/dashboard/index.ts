export interface DashboardData {
  produtos?: number;
  clientes?: number;
  vendas?: number;
  vendasPorMes?: Array<VendasPorMes>;
}

export interface VendasPorMes {
  mes?: number;
  valor?: number;
}
