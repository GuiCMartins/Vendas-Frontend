import { Menu } from "./menu";
import { ReactNode } from 'react';
import { Message } from "components";
import { Alert } from "components/common/message";

export const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  return (
    <div className="app">
      <section className="main-content columns is-fullheight">
      <Menu></Menu>
        <div className="container column is-10">
          <div className="section">
            <div className="card">
              <div className="card-header">
                <p className="card-header-title">{props.titulo}</p>
              </div>
              <div className="card-content">
                <div className="content">
                  {props.mensagens && 
                    props.mensagens.map(msg => <Message key={msg.texto} {...msg} />)
                  }
                  {props.children}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface LayoutProps {
  titulo?: string;
  children?: ReactNode;
  mensagens?: Array<Alert>
}
