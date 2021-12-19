import { Cliente } from "app/models/clientes";
import { Page } from "app/models/common/page";
import { ItemVenda, Venda } from "app/models/vendas";
import { useClienteService, useProdutoService } from "app/services";
import { useFormik } from "formik";
import {
  AutoComplete,
  AutoCompleteCompleteMethodParams,
  AutoCompleteChangeParams,
} from "primereact/autocomplete";
import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Produto } from "app/models/produtos";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { ValidationSchema } from "./validationSchema";

interface VendasFormProps {
  onSubmit: (venda: Venda) => void;
  onNovaVenda: () => void;
  vendaRealizada: boolean;
}

const formSchema: Venda = {
  cliente: undefined,
  itens: [],
  formaPagamento: "CARTAO",
  total: 0,
};

const formatador = new Intl.NumberFormat("pt-br", {
  style: "currency",
  currency: "BRL",
});

export const VendasForm: React.FC<VendasFormProps> = (
  props: VendasFormProps
) => {
  const formasPagamento: Array<string> = ["CARTAO", "DINHEIRO"];
  const clienteService = useClienteService();
  const produtoService = useProdutoService();
  const [produto, setProduto] = useState<Produto>();
  const [quantidade, setQuantidade] = useState<number>(1);
  const [mensagem, setMensagem] = useState<string>("");
  const [codigoProduto, setCodigoProduto] = useState<string>("");
  const [listaProduto, setListaProduto] = useState<Array<Produto>>([]);
  const [listaFiltradaProduto, setListaFiltradaProduto] = useState<
    Array<Produto>
  >([]);
  const [listaClientes, setListaClientes] = useState<Page<Cliente>>({
    content: [],
    first: 0,
    number: 0,
    size: 0,
    totalElements: 0,
  });

  const handleCLientesAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
    clienteService
      .find(e.query, "", 0, 20)
      .then((clientes) => setListaClientes(clientes));
  };

  const handleProdutosAutoComplete = async (
    e: AutoCompleteCompleteMethodParams
  ) => {
    if (!listaProduto.length) {
      const produtos = await produtoService.listar();
      setListaProduto(produtos);
    }

    const produtosFiltrados = listaProduto.filter((produto) => {
      return produto.nome?.toUpperCase().includes(e.query.toUpperCase());
    });

    setListaFiltradaProduto(produtosFiltrados);
  };

  const handleClienteChange = (e: AutoCompleteChangeParams) => {
    const clienteSelecionado: Cliente = e.value;
    formik.setFieldValue("cliente", clienteSelecionado);
  };

  const handleCodigoProdutoSelect = (event: any) => {
    if (codigoProduto) {
      produtoService
        .carregarProduto(codigoProduto)
        .then((produto) => setProduto(produto))
        .catch((e) => setMensagem("Produto não encontrado!"));
    }
  };

  const handleAddProduto = () => {
    formik.values.itens!.push({
      produto: produto as Produto,
      quantidade: quantidade,
    });
    setProduto(undefined);
    setCodigoProduto("");
    setQuantidade(1);

    formik.setFieldValue("total", totalVenda());
  };

  const totalVenda = () => {
    const totais = formik.values.itens?.map(
      (item) => item.quantidade * item.produto.preco!
    );

    if (totais?.length) {
      return totais?.reduce(
        (somaInicial = 0, somaAtual) => somaInicial + somaAtual
      );
    } else {
      return 0;
    }
  };

  const disableAddProdutoButton = (): boolean => {
    return !produto || !quantidade;
  };

  const dialogMensagemFooter = () => {
    return (
      <Button
        label="OK"
        onClick={(e) => {
          setMensagem("");
          setCodigoProduto("");
          setProduto(undefined);
        }}
      />
    );
  };

  const formik = useFormik({
    onSubmit: props.onSubmit,
    initialValues: formSchema,
    validationSchema: ValidationSchema,
  });

  const realizarNovaVenda = () => {
    props.onNovaVenda();
    formik.resetForm();
    formik.setFieldValue("itens", []);
    formik.setFieldTouched("itens", false)
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="p-fluid">
        <div className="p-field">
          <label htmlFor="cliente">Cliente: *</label>
          <AutoComplete
            id="cliente"
            name="cliente"
            field="nome"
            value={formik.values.cliente}
            suggestions={listaClientes.content}
            completeMethod={handleCLientesAutoComplete}
            onChange={handleClienteChange}
          />
          <small className="p-error p-d-block">{formik.errors.cliente}</small>
        </div>
        <div className="p-grid">
          <div className="p-col-2">
            <span className="p-float-label">
              <InputText
                id="codigoProduto"
                value={codigoProduto}
                onChange={(e) => setCodigoProduto(e.target.value)}
                onBlur={handleCodigoProdutoSelect}
              />
              <label htmlFor="codigoProduto">Código</label>
            </span>
          </div>
          <div className="p-col-6">
            <div className="p-field">
              <AutoComplete
                value={produto}
                id="produto"
                name="produto"
                field="nome"
                suggestions={listaFiltradaProduto}
                onChange={(e) => {
                  setProduto(e.value);
                }}
                completeMethod={handleProdutosAutoComplete}
              />
            </div>
          </div>
          <div className="p-col-2">
            <span className="p-float-label">
              <InputText
                id="qtdProduto"
                value={quantidade ? quantidade : 1}
                onChange={(e) => setQuantidade(parseInt(e.target.value))}
                type="number"
                min="1"
              />
              <label htmlFor="qtdProduto">Qtd</label>
            </span>
          </div>
          <div className="p-col-2">
            <Button
              type="button"
              label="Adicionar"
              onClick={handleAddProduto}
              disabled={disableAddProdutoButton()}
            />
          </div>

          <div className="p=col-12">
            <DataTable
              value={formik.values.itens}
              emptyMessage="Nenhum Produto Adicionado!"
            >
              <Column
                body={(item: ItemVenda) => {
                  const handleRemoverItem = () => {
                    const novaLista = formik.values.itens?.filter(
                      (itemExcluir) => itemExcluir.produto.id != item.produto.id
                    );

                    formik.values.itens = novaLista;

                    formik.setFieldValue("total", totalVenda());
                  };

                  return (
                    <Button
                      type="button"
                      label="Excluir"
                      onClick={handleRemoverItem}
                    />
                  );
                }}
              />
              <Column field="produto.id" header="Código" />
              <Column field="produto.sku" header="SKU" />
              <Column field="produto.nome" header="Produto" />
              <Column
                body={(item: ItemVenda) => {
                  return formatador.format(item.produto.preco!);
                }}
                header="Preço Unitário"
              />
              <Column field="quantidade" header="Qtd" />
              <Column
                body={(item: ItemVenda) => {
                  const total = item.produto.preco! * item.quantidade;
                  const totalFormatado = formatador.format(total);
                  return totalFormatado;
                }}
                header="Total"
              />
            </DataTable>
            <small className="p-error p-d-block">
              {formik.touched && formik.errors.itens}
            </small>
          </div>
          <div className="p-col-5">
            <div className="p-field">
              <label htmlFor="formaPgmt">Forma de pagamento: *</label>
              <Dropdown
                id="formaPgmt"
                options={formasPagamento}
                value={formik.values.formaPagamento}
                onChange={(e) =>
                  formik.setFieldValue("formaPagamento", e.value)
                }
                placeholder="Selecione..."
              />
              <small className="p-error p-d-block">
                {formik.touched && formik.errors.formaPagamento}
              </small>
            </div>
          </div>

          <div className="p-col-2">
            <div className="p-field">
              <label htmlFor="itens">Itens:</label>
              <InputText
                id="itens"
                disabled
                value={formik.values.itens?.length}
              />
            </div>
          </div>

          <div className="p-col-5">
            <div className="p-field">
              <label htmlFor="total">Total:</label>
              <InputText
                id="total"
                disabled
                value={formatador.format(formik.values.total!)}
              />
            </div>
          </div>
        </div>
        {!props.vendaRealizada && <Button type="submit" label="Finalizar" />}
        {props.vendaRealizada && (
          <Button
            type="button"
            label="Nova venda"
            className="p-button-success"
            onClick={realizarNovaVenda}
          />
        )}
      </div>
      <Dialog
        header="AVISO"
        position="top"
        visible={!!mensagem}
        onHide={() => setMensagem("")}
        footer={dialogMensagemFooter}
      >
        {mensagem}
      </Dialog>
    </form>
  );
};
