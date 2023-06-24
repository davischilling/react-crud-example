import { BrowserRouter, useNavigate } from 'react-router-dom';

import * as useStatefulUseCaseModule from '../../../../src/presentation/@shared/hooks/useStatefulUc';
import { CreateCategoryPage } from '../../../../src/presentation/modules/category/pages/create';
import { renderWithProviders } from '../../../utils/render-helper';
import { fireEvent, screen } from '@testing-library/dom';
import { act } from '@testing-library/react';
import Form from '../../../../src/presentation/modules/category/components/Form';
import { atom } from 'recoil';
import { State, CreateCategoryUseCase } from '../../../../src/domain/usecases/category/create';

jest.mock('recoil', () => ({
  atom: jest.fn().mockReturnValue({
    key: 'CreateCategoryUseCase',
    default: {
      category: { name: 'Mocked Category' },
    },
  }),
}));

jest.mock('../../../../src/presentation/modules/category/components/Form', () => ({
  __esModule: true,
  default: jest.fn(({ handleSubmit, handleToggle }) => (
    <div>
      Mocked Form Content
      <form onSubmit={handleSubmit}>
        <button onClick={handleToggle}>toggle</button>
        <button type="submit">submit</button>
      </form>
    </div>
  )),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('CreateCategoryPage', () => {
  let fragment: DocumentFragment;
  let useStatefulUseCaseSpy: jest.SpyInstance;

  let navigateSpy: jest.SpyInstance;

  let createCategorySpy: jest.SpyInstance;
  let setCategorySpy: jest.SpyInstance;
  let toggleIsActiveSpy: jest.SpyInstance;

  const mockState = { category: { name: 'Mocked Category' } };

  beforeEach(async () => {
    navigateSpy = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateSpy);

    createCategorySpy = jest.fn();
    setCategorySpy = jest.fn();
    toggleIsActiveSpy = jest.fn();

    useStatefulUseCaseSpy = jest
      .spyOn(useStatefulUseCaseModule as any, 'useStatefulRecoil')
      .mockReturnValue({
        state: mockState,
        useCase: {
          createCategory: createCategorySpy,
          setCategory: setCategorySpy,
          toggleIsActive: toggleIsActiveSpy,
        },
      });

    const { asFragment } = renderWithProviders<State>(
      <CreateCategoryPage />,
      ['/categories/create'],
      {
        wrapper: BrowserRouter,
      },
    );
    fragment = asFragment();
  });

  test('useStatefulRecoil to have been called correctly', () => {
    expect(useStatefulUseCaseSpy).toHaveBeenCalledTimes(1);
    expect(useStatefulUseCaseSpy).toHaveBeenCalledWith({
      UseCase: CreateCategoryUseCase,
      recoilState: expect.objectContaining({
        key: 'CreateCategoryUseCase',
        default: mockState,
      }),
    });
  });

  test('renders the "Create Category" page', () => {
    const titleElement = screen.getByText('Create Category');
    expect(titleElement).toBeInTheDocument();
    expect(fragment).toMatchSnapshot();
  });

  test('should correctly call useNavigate', () => {
    expect(useNavigate).toHaveBeenCalledTimes(1);
    expect(useNavigate).toHaveBeenCalledWith();
  });

  test('should call navigate and onSubmit when handleSubmit returned by useFormState hook is called', async () => {
    const formSubmitButton = screen.getByText('submit');

    await act(async () => {
      fireEvent.click(formSubmitButton);
    });

    expect(createCategorySpy).toHaveBeenCalledTimes(1);
    expect(createCategorySpy).toHaveBeenCalledWith();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/categories');
  });

  test('passes the correct props to the Form component', () => {
    expect(Form).toHaveBeenCalledWith(
      expect.objectContaining({
        category: mockState.category,
        isDisabled: false,
        handleToggle: expect.any(Function),
        handleChange: expect.any(Function),
        handleSubmit: expect.any(Function),
      }),
      {},
    );
  });
});
