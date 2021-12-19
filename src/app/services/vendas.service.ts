import { httpClient } from "app/http";
import { AxiosResponse } from "axios";
import { Venda } from "app/models/vendas";

const resourceUrl: string = "/api/vendas";

export const useVendasService = () => {
  const realizarVenda = async (venda: Venda): Promise<void> => {
    await httpClient.post<Venda>(resourceUrl, venda);
  };

  const gerarRelatorioVenda = async (
    idCliente: string = "",
    dataInicio: string = "",
    dataFim: string = ""
  ): Promise<Blob> => {
    const url = `${resourceUrl}/relatorios-vendas?id=${idCliente}&inicio=${dataInicio}&fim=${dataFim}`;
    const response: AxiosResponse = await httpClient.get(url, {
      responseType: "blob",
    });
    const bytes = response.data;
    return new Blob([bytes], { type: "application/pdf" });
  };

  return {
    gerarRelatorioVenda,
    realizarVenda,
  };
};
