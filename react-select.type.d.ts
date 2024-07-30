declare module "react-select" {
  import { Props as SelectProps } from "react-select";
  export { MultiValue } from "react-select";

  export interface CustomSelectProps extends SelectProps {
    isMulti?: boolean;
  }

  export default Select;
}
