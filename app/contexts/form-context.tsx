import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const FormContext = createContext<{
  setPrevent: Dispatch<SetStateAction<boolean>>;
  setAlert: Dispatch<SetStateAction<boolean>>;
}>({
  setPrevent: () => {},
  setAlert: () => {},
});

export const useFormContext = () => useContext(FormContext);
