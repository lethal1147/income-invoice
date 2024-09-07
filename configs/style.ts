import { StylesConfig, Props as SelectProps } from "react-select";

interface Option {
  label: string;
  value: string;
}

export const customStyles: StylesConfig<Option, false> = (errors: boolean) => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#ffffff", // var(--background)
    borderColor: errors ? "#ef4444" : "#e5e7eb", // var(--input)
    borderRadius: "0.5rem", // var(--radius)
    padding: "0.25rem",
    boxShadow: state.isFocused ? "0 0 0 2px #16A34A" : "none", // var(--ring)
    "&:hover": {
      borderColor: errors ? "#ef4444" : "#e5e7eb", // var(--input)
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#ffffff", // var(--popover)
    color: "#1f2937", // var(--popover-foreground)
    borderRadius: "0.5rem", // var(--radius)
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f3f4f6" : "#ffffff", // var(--muted) and var(--popover)
    color: "#1f2937", // var(--popover-foreground)
    "&:hover": {
      backgroundColor: "#f3f4f6", // var(--muted)
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#0f172a", // var(--foreground)
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6b7280", // var(--muted-foreground)
  }),
  input: (provided) => ({
    ...provided,
    color: "#0f172a", // var(--foreground)
  }),
});

export const customStylesNoBorder: StylesConfig<Option, false> = {
  control: (provided, state) => ({
    ...provided,
    border: "none",
    textDecoration: "underline",
    backgroundColor: "transparent", // var(--background)
    borderColor: "#e5e7eb", // var(--input)
    borderRadius: "0.5rem", // var(--radius)
    padding: "0.25rem",
    boxShadow: state.isFocused ? "0 0 0 2px #16A34A" : "none", // var(--ring)
    "&:hover": {
      borderColor: "#e5e7eb", // var(--input)
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#ffffff", // var(--popover)
    color: "#1f2937", // var(--popover-foreground)
    borderRadius: "0.5rem", // var(--radius)
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f3f4f6" : "#ffffff", // var(--muted) and var(--popover)
    color: "#1f2937", // var(--popover-foreground)
    "&:hover": {
      backgroundColor: "#f3f4f6", // var(--muted)
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#0f172a", // var(--foreground)
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6b7280", // var(--muted-foreground)
  }),
  input: (provided) => ({
    ...provided,
    color: "#0f172a", // var(--foreground)
  }),
};
