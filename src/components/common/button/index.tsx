export const ButtonComponent: React.FC<ButtonProps> = (props: ButtonProps) => {
  return (
    <div className="control">
      <button className={`button ${props.tipo}`} onClick={props.onClick} type={props.submit}>
        {props.label}
      </button>
    </div>
  );
};

interface ButtonProps {
  label: string;
  submit?: "submit";
  onClick?: (params?: any) => void;
  tipo?: string
}
