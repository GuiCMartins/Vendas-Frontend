import { Layout, ButtonComponent, Loader } from "components";
import Link from "next/link";
import { TabelaProdutos } from "./tabela";
import { Produto } from "app/models/produtos";
import useSWR from "swr";
import { httpClient } from "app/http";
import { AxiosResponse } from 'axios'
import Router from 'next/router';
import { useProdutoService } from "app/services";
import { useState, useEffect } from "react";
import { Alert } from "components/common/message";

export const ListagemProdutos: React.FC = () => {
  const service = useProdutoService();
  const [messages, setMessages] = useState<Array<Alert>>([]);
  const [lista, setLista] = useState<Array<Produto>>([]);
  const { data } = useSWR<AxiosResponse<Array<Produto>>>("/api/produtos", url => httpClient.get(url));

  useEffect(()=>{
    setLista(data?.data || []);
  }, [data])

  const editar = (produto: Produto) => {
    const url = `/cadastros/produtos?id=${produto.id}`;

    Router.push(url);
  }

  const deletar = (produto: Produto) => {
    service.deletarProduto(produto.id).then(response => {
      const novaLista: Array<Produto> = lista.filter(p => p.id != produto.id);
      setLista(novaLista);
      setMessages([{
        tipo: "success", texto: "Produto excluido com sucesso!!"
      }]);
    });
  }

  return (
    <Layout titulo="Listagem de produtos" mensagens={messages}>
      <Link href="/cadastros/produtos">
        <ButtonComponent label="Novo" tipo="is-warning" />
      </Link>
      <br />
      <Loader show={!data}/>
      <TabelaProdutos onDelete={deletar} onEdit={editar} produtos={lista} />
    </Layout>
  );
};
