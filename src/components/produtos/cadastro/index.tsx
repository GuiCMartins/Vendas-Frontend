import { Layout, Input, InputMoney, Textarea, ButtonComponent } from "components";
import { useState, useEffect } from "react";
import { useProdutoService } from "app/services";
import { Produto } from "app/models/produtos";
import { converterEmBigDecimal, formatReal } from "app/util/money";
import { Alert } from "components/common/message";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/router";

const msgCampoObrigatorio = "Campo obrigatório!";

const validationSchema = yup.object().shape({
  sku: yup.string().trim().required(msgCampoObrigatorio),
  nome: yup.string().trim().required(msgCampoObrigatorio),
  preco: yup
    .number()
    .required(msgCampoObrigatorio)
    .moreThan(0, "Valor deve ser maior que 0,00!"),
  descricao: yup.string().trim().required(msgCampoObrigatorio),
});

interface FormErros {
  sku?: string;
  nome?: string;
  preco?: string;
  descricao?: string;
}

export const CadastroProdutos: React.FC = () => {
  const service = useProdutoService();
  const [sku, setSku] = useState<string>("");
  const [preco, setPreco] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [cadastro, setCadastro] = useState<string>("");
  const [messages, setMessages] = useState<Array<Alert>>([]);
  const [erros, setErros] = useState<FormErros>({});
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      service.carregarProduto(router.query.id).then((produtoCarregado) => {        
        setId(produtoCarregado.id!);
        setSku(produtoCarregado.sku!);
        setNome(produtoCarregado.nome!);
        setDescricao(produtoCarregado.descricao!);
        setCadastro(produtoCarregado.cadastro!)
        setPreco(formatReal(`${produtoCarregado.preco}`));
      });
    }
  }, [router.query.id]);

  const submit = () => {
    const produto: Produto = {
      id,
      sku,
      preco: converterEmBigDecimal(preco),
      nome,
      descricao,
    };

    validationSchema
      .validate(produto)
      .then(() => {
        setErros({});
        if (id) {
          service.atualizar(produto).then(() => {
            setMessages([
              { tipo: "success", texto: "Produto atualizado com sucesso" },
            ]);
          });
        } else {
          service.salvar(produto).then((p) => {
            setId(p.id!);
            setCadastro(p.cadastro!);
            setMessages([
              { tipo: "success", texto: "Produto salvo com sucesso" },
            ]);
          });
        }
      })
      .catch((err) => {
        const field = err.path;
        const message = err.message;

        setErros({
          [field]: message,
        });
      });
  };

  return (
    <Layout titulo="Cadastro de produtos" mensagens={messages}>
      {id && (
        <div className="columns">
          <Input
            id="inputId"
            label="Código:"
            columnClasses="is-half"
            value={id}
            disabled
          />
          <Input
            id="inputCadastro"
            label="Data de cadastro:"
            columnClasses="is-half"
            value={cadastro}
            disabled
          />
        </div>
      )}
      <div className="columns">
        <Input
          id="inputSku"
          label="SKU*"
          nome="inputSku"
          placeholder="Digite o SKU do produto"
          columnClasses="is-half"
          value={sku}
          onChange={setSku}
          error={erros.sku}
        />
        <InputMoney
          id="inputPreco"
          nome="inputPreco"
          label="Preço*"
          placeholder="Digite o preço do produto"
          columnClasses="is-half"
          value={preco}
          onChange={setPreco}
          maxLenght={16}
          error={erros.preco}
        />
      </div>
      <div className="columns">
        <Input
          id="inputNome"
          nome="inputNome"
          label="Nome*"
          placeholder="Digite o nome do produto"
          columnClasses="is-full"
          value={nome}
          onChange={setNome}
          error={erros.nome}
        />
      </div>
      <div className="columns">
        <Textarea
          id="inputDescricao"
          label="Descrição*"
          placeholder="Digite a descrição do produto"
          columnClasses="is-full"
          value={descricao}
          onChange={setDescricao}
          error={erros.descricao}
        />
      </div>

      <div className="field is-grouped">
        <ButtonComponent label={id ? "Atualizar" : "Salvar"} onClick={submit} tipo="is-success"/>
        <Link href="/consultas/produtos">
          <ButtonComponent label="voltar" />
        </Link>
      </div>
    </Layout>
  );
};
