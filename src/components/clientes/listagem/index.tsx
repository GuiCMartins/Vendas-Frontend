import { Cliente } from "app/models/clientes";
import { Layout } from "components";
import { Input, ButtonComponent } from "components";
import { useFormik } from "formik";
import Inputmask from "inputmask";
import { useState, useEffect } from "react";
import { DataTable, DataTablePageParams } from "primereact/datatable";
import { Column } from "primereact/column";
import { Page } from "app/models/common/page";
import { useClienteService } from "app/services";
import { Button } from "primereact/button";
import Router from "next/router";
import { confirmDialog } from 'primereact/confirmdialog'

export const ListagemClientes: React.FC = () => {
  const handleSubmit = () => {
    setLoading(true);
    service
      .find(formik.values.nome, formik.values.cpf)
      .then((result) => {
        setClientes(result);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  const service = useClienteService();

  const clienteFormInitialValues = {
    nome: "",
    cpf: "",
  };

  const formik = useFormik<ConsultaClienteForm>({
    onSubmit: handleSubmit,
    initialValues: clienteFormInitialValues,
  });

  const handlePage = (event: DataTablePageParams) => {
    setLoading(true);
    service
      .find(formik.values.nome, formik.values.cpf, event.page, event.rows)
      .then((result) => {
        setClientes({ ...result, first: event.first });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deletar = (cliente: Cliente) => {
    service.deletarCliente(cliente.id).then(result => {
      handleSubmit();
    });
  }

  const actionTemplate = (registro: Cliente) => {
    const url = `/cadastros/clientes?id=${registro.id}`;
    return (
      <div>
        <Button
          label="Editar"
          className="p-button-rounded p-button-info"
          onClick={(e) => Router.push(url)}
        />
        <Button label="Deletar" className="p-button-rounded p-button-danger" onClick={e => {
          confirmDialog({
            header: 'Confirmação',
            message: 'Confrimar exclusão?',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => deletar(registro)
          })
        }}/>
      </div>
    );
  };

  const [clientes, setClientes] = useState<Page<Cliente>>({
    content: [],
    first: 0,
    number: 0,
    size: 5,
    totalElements: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Layout titulo="Clientes">
      <form onSubmit={formik.handleSubmit}>
        <div className="columns">
          <Input
            id="nome"
            nome="nome"
            label="Nome"
            value={formik.values.nome}
            onChange={formik.handleChange}
            formik
            columnClasses="is-half"
          />
          <Input
            id="cpf"
            nome="cpf"
            label="CPF"
            value={formik.values.cpf}
            columnClasses="is-half"
            formik
            onChange={formik.handleChange}
            mask={new Inputmask("999.999.999-99")}
          />
        </div>
        <div className="field is-grouped">
          <div className="control is-link">
            <ButtonComponent
              label="Consultar"
              submit="submit"
              tipo="is-success"
            />
          </div>
          <div className="control is-link">
            <ButtonComponent
              label="Novo"
              onClick={e => Router.push("/cadastros/clientes")}
              tipo="is-warning"
            />
          </div>
        </div>
      </form>
      <br />
      <div className="columns">
        <div className="is-full">
          <DataTable
            value={clientes.content}
            totalRecords={clientes.totalElements}
            lazy
            paginator
            first={clientes.first}
            rows={clientes.size}
            onPage={handlePage}
            loading={loading}
            emptyMessage="Nenhum cliente encontrado!"
          >
            <Column field="id" header="Código" />
            <Column field="nome" header="Nome" />
            <Column field="cpf" header="CPF" />
            <Column field="email" header="E-mail" />
            <Column body={actionTemplate} />
          </DataTable>
        </div>
      </div>
    </Layout>
  );
};

interface ConsultaClienteForm {
  nome?: string;
  cpf?: string;
}
