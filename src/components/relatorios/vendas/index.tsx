import { Layout } from "components";
import { useFormik } from "formik";
import {
  AutoComplete,
  AutoCompleteChangeParams,
  AutoCompleteCompleteMethodParams,
} from "primereact/autocomplete";
import { Page } from "app/models/common/page";
import { Cliente } from "app/models/clientes";
import { useState } from "react";
import { useClienteService, useVendasService } from "app/services";
import { Button } from "primereact/button";
import { Input } from "components";
import Inputmask from "inputmask";

export const RelatoriosVendas: React.FC = () => {
  const clienteService = useClienteService();
  const vendasService = useVendasService();
  const [clientes, setClientes] = useState<Page<Cliente>>({
    content: [],
    first: 0,
    number: 0,
    size: 20,
    totalElements: 0,
  });

  const handleSubmit = (formData: RelatoriosVendasForm) => {
    vendasService
      .gerarRelatorioVenda(
        formData.cliente?.id,
        formData?.dataInicio,
        formData?.dataFim
      )
      .then((blob) => {
        const fileUrl = URL.createObjectURL(blob);
        window.open(fileUrl);
      });
    console.log(formData);
  };

  const handleClienteAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
    const nome = e.query;
    clienteService
      .find(nome, "", 0, 20)
      .then((cliente) => setClientes(cliente));
  };

  const formik = useFormik<RelatoriosVendasForm>({
    onSubmit: handleSubmit,
    initialValues: { cliente: { nome: "" }, dataInicio: "", dataFim: "" },
  });

  return (
    <Layout titulo="Relatório de vendas">
      <form onSubmit={formik.handleSubmit}>
        <div className="p-fluid">
          <div className="p-grid">
            <div className="p-col-12">
              <label htmlFor="cliente">Cliente:</label>
              <AutoComplete
                suggestions={clientes.content}
                completeMethod={handleClienteAutoComplete}
                value={formik.values.cliente}
                field="nome"
                id="cliente"
                name="cliente"
                onChange={(e: AutoCompleteChangeParams) => {
                  formik.setFieldValue("cliente", e.value);
                }}
              />
            </div>
            <div className="p-col-6">
              <Input
                id="dataInicio"
                nome="dataInicio"
                label="Data início"
                value={formik.values.dataInicio}
                formik
                mask={new Inputmask({ mask: "99/99/9999", placeholder: "" })}
                onChange={formik.handleChange}
              />
            </div>
            <div className="p-col-6">
              <Input
                id="dataFim"
                nome="dataFim"
                label="Data fim"
                formik
                mask={new Inputmask({ mask: "99/99/9999", placeholder: "" })}
                value={formik.values.dataFim}
                onChange={formik.handleChange}
              />
            </div>
            <div className="p-col">
              <Button label="Gerar" type="submit" />
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};

interface RelatoriosVendasForm {
  cliente: Cliente;
  dataInicio: string;
  dataFim: string;
}
