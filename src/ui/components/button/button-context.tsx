import { createContext, useContext } from 'react';
import { EButtonSize, EButtonVariant, IButtonContext } from './button.types';

const ButtonContext = createContext<IButtonContext>({
  variant: EButtonVariant.DEFAULT,
  size: EButtonSize.DEFAULT,
  disabled: false,
});

export const ButtonProvider = ButtonContext.Provider;

export const useButtonContext = (): IButtonContext => {
  const context = useContext(ButtonContext);
  return context;
};
