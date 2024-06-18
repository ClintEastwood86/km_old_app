import { createContext, PropsWithChildren } from 'react';

interface ILayoutContext {
	openLoginModal: () => void;
	openRegisterModal: () => void;
}

export const LayoutContext = createContext<ILayoutContext | null>(null);

export const LayoutContextProvider = ({ openLoginModal, openRegisterModal, children }: PropsWithChildren<Required<ILayoutContext>>) => {
	return <LayoutContext.Provider value={{ openLoginModal, openRegisterModal }}>{children}</LayoutContext.Provider>;
};
