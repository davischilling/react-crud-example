import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import React, { PropsWithChildren } from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { MutableSnapshot, RecoilRoot, RecoilState } from 'recoil';

type ExtendedRenderOptions<State> = {
  state?: State;
  states?: { atom: RecoilState<State>; value: State }[];
};

export function renderWithProviders<State>(
  ui: React.ReactElement,
  initialEntries: string[] = ['/'],
  { states = [], ...renderOptions }: ExtendedRenderOptions<State> & RenderOptions = {},
) {
  const initializeState = ({ set }: MutableSnapshot): void => {
    [...states, { atom: {} as any, value: {} as any }].forEach((state) =>
      set(state.atom, state.value),
    );
  };
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <RecoilRoot initializeState={initializeState}>
        <BrowserRouter>
          <SnackbarProvider>
            <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
          </SnackbarProvider>
        </BrowserRouter>
      </RecoilRoot>
    );
  }

  return { states, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
