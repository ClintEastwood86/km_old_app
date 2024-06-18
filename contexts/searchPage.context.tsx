import { PropsWithChildren, createContext } from 'react';

interface ISearchPageContext {
	clearButton: HTMLButtonElement | null;
}

export const SearchPageContext = createContext<ISearchPageContext>({ clearButton: null });

export const SearchPageContextProvider = ({ clearButton, children }: PropsWithChildren<ISearchPageContext>) => {
	return <SearchPageContext.Provider value={{ clearButton }}>{children}</SearchPageContext.Provider>;
};
