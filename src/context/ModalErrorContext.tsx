import React, { useState, useContext } from "react";

export interface IModalErrorContext {
  showModalError: boolean;
  setShowModalError: (visible: boolean) => void;
}

const defaultValues = {
  showModalError: false,
  setShowModalError: () => {},
};

export const ModalErrorProviderContext = React.createContext<IModalErrorContext>(defaultValues);

export const useModalError = () => useContext<IModalErrorContext>(ModalErrorProviderContext);

export function ModalErrorProvider({ children }: any) {
  const [showModalError, setShowModalError] = useState<boolean>(false);

  return (
    <ModalErrorProviderContext.Provider value={{ showModalError, setShowModalError }}>
      {children}
    </ModalErrorProviderContext.Provider>
  );
}
