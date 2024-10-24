/* eslint-disable react/prop-types */
import Button from "./Button";
import Input from "./Input";
import Label from "./Formlabel";
const Form = ({ inputs, onSubmit, loading, error }) => {
  return (
    <div>
      {inputs.map((input, index) => (
        <div key={index} className="mb-2">
          <Label htmlFor={input.for} value={input.label} />

          <Input
            type={input.type}
            id={input.id}
            name={input.name}
            placeholder={input.placeholder}
            value={input.value}
            onChange={(e) => input.onChange(e.target.value)}
            error={error}
          />
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        </div>
      ))}
      <Button onClick={onSubmit} disabled={loading}>
        {loading ? "Loading..." : "Next"}
      </Button>
    </div>
  );
};

export default Form;
