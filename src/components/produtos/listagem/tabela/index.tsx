import { useState } from "react";
import { Produto } from "app/models/produtos";
import { ButtonComponent } from "components";

export const TabelaProdutos: React.FC<TabelaProdutoProps> = (
  props: TabelaProdutoProps
) => {
  return (
    <table className="table is-bordered is-tripped is-hoverable">
      <thead>
        <tr>
          <th>Código</th>
          <th>Sku</th>
          <th>Nome</th>
          <th>Preço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {props.produtos.map((produto) => {
          return <ProdutoRow onEdit={props.onEdit} onDelete={props.onDelete} key={produto.id} produto={produto} />;
        })}
      </tbody>
    </table>
  );
};

const ProdutoRow: React.FC<ProdutoRowProps> = (props: ProdutoRowProps) => {

  const [deletando, setDeletando] = useState<boolean>(false);

  const cancelaDelete = () => {
    setDeletando(false);
  }

  const confirmacaoDeletar = (produto: Produto) => {
    if(deletando){
      props.onDelete(produto);
      setDeletando(false);
    }
    else{
      setDeletando(true);
    }
  }

  return (
    <tr>
      <td>{props.produto.id}</td>
      <td>{props.produto.sku}</td>
      <td>{props.produto.nome}</td>
      <td>{props.produto.preco}</td>
      <td>

        {!deletando &&
          <ButtonComponent label="Editar" tipo="is-success is-rounded is-small" onClick={(produto: Produto) => props.onEdit(props.produto)}/>
        }
        <ButtonComponent label={deletando ? "Confirmar?" : "Deletar"} tipo="is-danger is-rounded is-small" onClick={(produto: Produto) => confirmacaoDeletar(props.produto)}/>
        {deletando &&
          <ButtonComponent label="Cancelar" tipo="is-rounded is-small" onClick={(produto: Produto) => cancelaDelete()}/>
        }
      </td>
    </tr>
  );
};

interface ProdutoRowProps {
  produto: Produto;
  onDelete: (produto: Produto) => void;
  onEdit: (produto: Produto) => void;
}

interface TabelaProdutoProps {
  produtos: Array<Produto>;
  onDelete: (produto: Produto) => void;
  onEdit: (produto: Produto) => void;
}
