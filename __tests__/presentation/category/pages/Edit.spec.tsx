import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate, useParams } from 'react-router-dom';
import * as useStatefulUseCaseModule from '../../../../src/presentation/@shared/hooks/useStatefulUc';
import Form from '../../../../src/presentation/modules/category/components/Form';
import { EditCategoryPage } from '../../../../src/presentation/modules/category/pages/edit';
import { atom } from 'recoil';
import { State, EditCategoryUseCase } from '../../../../src/domain/usecases/category/edit';
import { renderWithProviders } from '../../../utils/render-helper';

jest.mock('recoil', () => ({
  atom: jest.fn().mockReturnValue({
    key: 'EditCategoryUseCase',
    default: { category: { name: 'Mocked Category' }, isLoading: false },
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
  useParams: jest.fn().mockReturnValue({ id: '1' }),
}));

describe('EditCategoryPage', () => {
  let fragment: DocumentFragment;
  let useStatefulUseCaseSpy: jest.SpyInstance;

  let navigateSpy: jest.SpyInstance;
  let updateCategorySpy: jest.SpyInstance;

  let setCategorySpy: jest.SpyInstance;
  let toggleIsActiveSpy: jest.SpyInstance;
  const mockState = { category: { name: 'Mocked Category' }, isLoading: false };

  beforeEach(async () => {
    jest.clearAllMocks();
    navigateSpy = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateSpy);
    updateCategorySpy = jest.fn();
    setCategorySpy = jest.fn();
    toggleIsActiveSpy = jest.fn();
    useStatefulUseCaseSpy = jest
      .spyOn(useStatefulUseCaseModule as any, 'useStatefulRecoil')
      .mockReturnValue({
        state: mockState,
        useCase: {
          updateCategory: updateCategorySpy,
          setCategory: setCategorySpy,
          toggleIsActive: toggleIsActiveSpy,
        },
      });
    const { asFragment } = renderWithProviders<State>(
      <EditCategoryPage />,
      ['/categories/edit/1'],
      {
        wrapper: BrowserRouter,
      },
    );
    fragment = asFragment();
  });

  test('renders the "Edit Category" page', () => {
    const titleElement = screen.getByText('Edit Category');
    expect(titleElement).toBeInTheDocument();
    expect(fragment).toMatchSnapshot();
  });

  test('calls useStatefulUseCase with correct arguments', () => {
    expect(useStatefulUseCaseSpy).toHaveBeenCalledTimes(1);
    expect(useStatefulUseCaseSpy).toHaveBeenCalledWith({
      UseCase: EditCategoryUseCase,
      recoilState: expect.objectContaining({
        key: 'EditCategoryUseCase',
        default: mockState,
      }),
      INITIAL_STATE: expect.objectContaining({
        category: {
          id: '1',
          name: '',
          description: '',
          is_active: true,
        },
      }),
    });
  });

  test('should correctly call useParams', () => {
    expect(useParams).toHaveBeenCalledTimes(1);
    expect(useParams).toHaveBeenCalledWith();
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

    expect(updateCategorySpy).toHaveBeenCalledTimes(1);
    expect(updateCategorySpy).toHaveBeenCalledWith();
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
