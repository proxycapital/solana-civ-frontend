import React, { useState, useContext } from 'react'

export interface IModalErrorContext {
  showError: boolean;
  setShowError: (visible: boolean) => void;
}

const defaultValues = {
  showError: false,
  setShowError: () => {},
}

export const ModalErrorProviderContext = React.createContext<IModalErrorContext>(defaultValues)

export const useModalError = () => useContext<IModalErrorContext>(ModalErrorProviderContext)

export function ModalErrorProvider({ children }: any) {
  const [showError, setShowError] = useState<boolean>(false)
  
  return (
    <ModalErrorProviderContext.Provider value={{ showError, setShowError }}>
      {children}
    </ModalErrorProviderContext.Provider>
  )
}