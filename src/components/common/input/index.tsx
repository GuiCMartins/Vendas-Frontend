import { formatReal } from "app/util/money";
import Inputmask from "inputmask";

export const Input: React.FC<InputProps> = (props: InputProps) => {
  const onInputChange = (event: any) => {
    var value = event?.target.value;

    if(props.formatter){
      value = props.formatter(value as string);
    }

    if(props.mask){
      const name = event?.target.name;
      var element = document.getElementById(name);

      props.mask.mask(element!);
    }

    props.formik ? props.onChange!(event) : props.onChange!(value);
  };

  return (
    <div className={`field column ${props.columnClasses}`}>
      <label className="label" htmlFor={props.id}>
        {props.label}
      </label>
      <div className="control">
        <input
          className="input"
          id={props.id}
          autoComplete={props.autoComplete}
          name={props.nome}
          disabled={props.disabled}
          value={props.value}
          onChange={onInputChange}
          placeholder={props.placeholder}
          maxLength={props.maxLenght}
        ></input>
        {props.error && <p className="help is-danger"> {props.error} </p>}
      </div>
    </div>
  );
};

export const InputMoney: React.FC<InputProps> = (props: InputProps) => {
  return <Input {...props} formatter={formatReal} />;
};

interface InputProps {
  id: string;
  label: string;
  nome?: string;
  autoComplete?: string;
  placeholder?: string;
  value: any;
  columnClasses?: string;
  disabled?: boolean;
  formik?: boolean;
  onChange?: (value: any) => void;
  formatter?: (value: string) => string;
  mask?: Inputmask.Instance;
  maxLenght?: number;
  error?: string;
}
