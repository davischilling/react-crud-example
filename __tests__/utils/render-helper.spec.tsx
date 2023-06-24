import { BrowserRouter } from 'react-router-dom';
import { renderWithProviders } from './render-helper';

describe('RenderWithProviders', () => {
  test('renders children with providers', () => {
    const { asFragment } = renderWithProviders<{
      mockState: any;
    }>(
      <div>
        <p>Mocked Content</p>
      </div>,
      ['/mocked-path'],
      {
        wrapper: BrowserRouter,
      },
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders children with providers and initial state', () => {
    const { asFragment } = renderWithProviders<{
      mockState: any;
    }>(
      <div>
        <p>Mocked Content</p>
      </div>,
      ['/mocked-path'],
      {
        wrapper: BrowserRouter,
        states: [
          {
            atom: {} as any,
            value: {
              mockState: {
                isLoading: false,
                data: [],
              },
            },
          },
        ],
      },
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('should execute initializeState correctly', () => {
    const set = jest.fn();
    const states = [
      {
        atom: {} as any,
        value: {
          mockState: {
            isLoading: false,
            data: [],
          },
        },
      },
      {
        atom: {} as any,
        value: {
          mockState: {
            isLoading: false,
            data: [],
          },
        },
      },
    ];
    const initializeState = ({ set }: any): void => {
      [...states, { atom: {} as any, value: {} as any }].forEach((state) =>
        set(state.atom, state.value),
      );
    };
    initializeState({ set });
    expect(set).toHaveBeenCalledTimes(3);
    expect(set).toHaveBeenCalledWith(states[0].atom, states[0].value);
    expect(set).toHaveBeenCalledWith(states[1].atom, states[1].value);
  });
});
