/* eslint-disable react/prop-types */
import { InputText } from "primereact/inputtext";

const Input = (props) => {
  const {
    id,
    className,
    name,
    label,
    placeholder,
    type,
    value,
    handler,
    validationMessage,
    disabled,
  } = props;

  return (
    <div className="mb-2 grid gap-1 relative">
      <label htmlFor={id}>{label}</label>
      <InputText
        id={id}
        name={name}
        placeholder={placeholder}
        className={`app-input h-8 p-2 border border-primary-light-900 outline-none text-sm text-primary-pText ${
          className ?? ""
        }`}
        type={type ?? "text"}
        value={value}
        onChange={handler}
        disabled={disabled}
      />
      <small>{validationMessage}</small>
    </div>
  );
};

export default Input;
