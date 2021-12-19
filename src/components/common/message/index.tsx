export const Message: React.FC<MesssageProps> = (props: MesssageProps) => {
  return (
    <article className={`message is-${props.tipo}`}>
      <div className="message-body">
        {props.field && `${props.field}: `}{props.texto}
      </div>
    </article>
  );
};

export interface Alert {
    tipo: string
    field?: string
    texto: string
}

interface MesssageProps {
    tipo: string
    field?: string
    texto: string
}