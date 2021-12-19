import { Venda } from "app/models/vendas";
import { useVendasService } from "app/services";
import { Layout } from "components";
import { VendasForm } from "./form";
import { Alert } from "components/common/message";
import { useState } from "react";

export const Vendas: React.FC = () => {
  const vendasService = useVendasService();
  const [messages, setMessages] = useState<Array<Alert>>([]);
  const [vendaRealizada, setVendaRealizada] = useState<boolean>(false);

  const handleSubmit = (venda: Venda) => {
    vendasService
      .realizarVenda(venda)
      .then((response) => {
        setMessages([
          {
            texto: "Venda realizada com sucesso",
            tipo: "success",
          },
        ]);
        setVendaRealizada(true);
      })
      .catch((err) => {
        setMessages([
          {
            texto: "Não foi possível realizar a venda",
            tipo: "danger",
          },
        ]);
      });
  };

  const handleNovaVenda = () => {
    setVendaRealizada(false);
    setMessages([]);
  };

  return (
    <Layout titulo="Minhas vendas" mensagens={messages}>
      <VendasForm
        onSubmit={handleSubmit}
        vendaRealizada={vendaRealizada}
        onNovaVenda={handleNovaVenda}
      />
    </Layout>
  );
};
