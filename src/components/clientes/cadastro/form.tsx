import { Cliente } from "app/models/clientes";
import { useFormik } from "formik";
import { Input, ButtonComponent } from "components";
import Inputmask from "inputmask";
import * as yup from "yup";
import Router from "next/router";

export const ClienteForm: React.FC<ClienteFormProps> = (
  props: ClienteFormProps
) => {
  const formik = useFormik<Cliente>({
    initialValues: { ...formSchema, ...props.cliente },
    onSubmit: props.onSubmit,
    enableReinitialize: true,
    validationSchema: validationSchema,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.values.id && (
        <div className="columns">
          <Input
            id="id"
            nome="id"
            autoComplete="off"
            columnClasses="is-half"
            disabled
            label="Código: "
            value={formik.values.id}
          />
          <Input
            id="dataCadastro"
            nome="dataCadastro"
            autoComplete="off"
            disabled
            columnClasses="is-half"
            label="Data de cadastro: "
            value={formik.values.dataCadastro}
          />
        </div>
      )}
      <div className="columns">
        <Input
          id="nome"
          nome="nome"
          autoComplete="off"
          formik
          columnClasses="is-full"
          label="Nome: *"
          onChange={formik.handleChange}
          value={formik.values.nome}
          error={formik.errors.nome}
        />
      </div>
      <div className="columns">
        <Input
          id="cpf"
          nome="cpf"
          autoComplete="off"
          formik
          mask={new Inputmask({ mask: "999.999.999-99", placeholder: "" })}
          columnClasses="is-half"
          label="CPF: *"
          onChange={formik.handleChange}
          value={formik.values.cpf}
          error={formik.errors.cpf}
        />
        <Input
          id="dataNascimento"
          nome="dataNascimento"
          autoComplete="off"
          formik
          mask={new Inputmask({ mask: "99/99/9999", placeholder: "" })}
          columnClasses="is-half"
          label="Data de nascimento: *"
          onChange={formik.handleChange}
          value={formik.values.dataNascimento}
          error={formik.errors.dataNascimento}
        />
      </div>
      <div className="columns">
        <Input
          id="endereco"
          nome="endereco"
          formik
          autoComplete="off"
          columnClasses="is-full"
          label="Endereco: *"
          onChange={formik.handleChange}
          value={formik.values.endereco}
          error={formik.errors.endereco}
        />
      </div>
      <div className="columns">
        <Input
          id="email"
          nome="email"
          autoComplete="off"
          formik
          columnClasses="is-half"
          label="E-mail: *"
          onChange={formik.handleChange}
          value={formik.values.email}
          error={formik.errors.email}
        />
        <Input
          id="telefone"
          nome="telefone"
          formik
          mask={new Inputmask({ mask: "(99)99999-9999", placeholder: "" })}
          autoComplete="off"
          columnClasses="is-half"
          label="Telefone: *"
          onChange={formik.handleChange}
          value={formik.values.telefone}
          error={formik.errors.telefone}
        />
      </div>

      <div className="field is-grouped">
        <div className="control is-link">
          <ButtonComponent
            label={formik.values.id ? "Atualizar" : "Salvar"}
            tipo="is-success"
            submit="submit"
          />
        </div>
        <div className="control is-link">
          <ButtonComponent
            label={"Voltar"}
            onClick={(e) => Router.push("/consultas/clientes")}
          />
        </div>
      </div>
    </form>
  );
};

interface ClienteFormProps {
  cliente: Cliente;
  onSubmit: (cliente: Cliente) => void;
}

const campoObrigatorioMsg = "CampoObrigatorio";

const validationSchema = yup.object().shape({
  nome: yup.string().trim().required(campoObrigatorioMsg),
  cpf: yup
    .string()
    .trim()
    .required(campoObrigatorioMsg)
    .length(14, "CPF inválido!"),
  dataNascimento: yup
    .string()
    .trim()
    .required(campoObrigatorioMsg)
    .length(10, "Data inválida!"),
  email: yup
    .string()
    .trim()
    .required(campoObrigatorioMsg)
    .email("Email inválido!"),
  endereco: yup.string().trim().required(campoObrigatorioMsg),
  telefone: yup.string().trim().required(campoObrigatorioMsg),
});

const formSchema: Cliente = {
  dataCadastro: "",
  cpf: "",
  dataNascimento: "",
  email: "",
  endereco: "",
  id: "",
  nome: "",
  telefone: "",
};
