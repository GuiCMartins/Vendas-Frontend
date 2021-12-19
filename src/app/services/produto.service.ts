import { httpClient } from "app/http";
import { Produto } from "app/models/produtos";
import { AxiosResponse } from "axios";

const resourceUrl: string = "/api/produtos";

export const useProdutoService = () => {
  const salvar = async (produto: Produto): Promise<Produto> => {
    const response: AxiosResponse<Produto> = await httpClient.post<Produto>(
      resourceUrl,
      produto
    );
    return response.data;
  };

  const atualizar = async (produto: Produto): Promise<void> => {
    const url = `${resourceUrl}/${produto.id}`;
    await httpClient.put<Produto>(url, produto);
  };

  const carregarProduto = async (id: any): Promise<Produto> => {
    const url = `${resourceUrl}/${id}`;
    const response: AxiosResponse<Produto> = await httpClient.get(url);
    return response.data;
  };

  const deletarProduto = async (id: any): Promise<void> => {
    const url = `${resourceUrl}/${id}`;
    const response: AxiosResponse<Produto> = await httpClient.delete(url);
  };

  const listar = async (): Promise<Array<Produto>> => {
    const response: AxiosResponse<Array<Produto>> = await httpClient.get(resourceUrl);
    return response.data;
  };

  return {
    salvar,
    atualizar,
    carregarProduto,
    deletarProduto,
    listar
  };
};
