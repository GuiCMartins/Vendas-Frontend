import { Layout } from "components";
import { ClienteForm } from "./form";
import { useState } from "react";
import { Cliente } from "app/models/clientes";
import { useClienteService } from "app/services";
import { Alert } from "components/common/message";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const CadastroCLiente: React.FC = () => {
  const [cliente, setCliente] = useState<Cliente>({});
  const [mensagens, setMensagens] = useState<Array<Alert>>([]);
  const service = useClienteService();
  const router = useRouter();

  useEffect(() => {
    if(router.query.id){
      service.carregarCliente(router.query.id).then(cliente => setCliente(cliente))
    }
  }, [router.query.id])

  const handleSubmit = (cliente: Cliente) => {
    if (cliente.id) {
      service.atualizar(cliente).then((response) => {
        setMensagens([
          { tipo: "success", texto: "Cliente atualizado com sucesso" },
        ]);
      });
    } else {
      service.salvar(cliente).then((response) => {
        setCliente(response);
        setMensagens([
          { tipo: "success", texto: "Cliente salvo com sucesso" },
        ]);
      });
    }
  };

  return (
    <Layout titulo="Clientes" mensagens={mensagens}>
      <ClienteForm cliente={cliente} onSubmit={handleSubmit} />
    </Layout>
  );
};
