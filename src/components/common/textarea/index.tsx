export const Textarea: React.FC<TextareaProps> = (props: TextareaProps) => {
  return (
    <div className={`field column ${props.columnClasses}`}>
      <label className="label" htmlFor={props.id}>
        {props.label}
      </label>
      <div className="control">
        <textarea
          className="textarea"
          id={props.id}
          value={props.value}
          onChange={(event) => {
            if (props.onChange) props.onChange(event.target.value);
          }}
          placeholder={props.placeholder}
        />
        {props.error && <p className="help is-danger">{props.error}</p>}
      </div>
    </div>
  );
};

interface TextareaProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  columnClasses?: string;
  onChange?: (value: any) => void;
  error?: string;
}
