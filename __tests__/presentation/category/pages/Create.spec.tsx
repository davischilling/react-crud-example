import { act, fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import * as useStatefulRecoilModule from '../../../../src/presentation/@shared/hooks/useStatefulUc';
import Form from '../../../../src/presentation/modules/category/components/Form';
import { CreateCategoryPage } from '../../../../src/presentation/modules/category/pages/create';
import { RecoilRoot } from 'recoil';

jest.mock('recoil', () => ({
  __esModule: true,
  atom: jest.fn().mockReturnValue({ key: 'MockedAtom' }),
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
  let useStatefulRecoil: jest.SpyInstance;

  let navigateSpy: jest.SpyInstance;

  let createCategorySpy: jest.SpyInstance;
  let setCategorySpy: jest.SpyInstance;
  let toggleIsActiveSpy: jest.SpyInstance;

  const mockState = { category: { name: 'Mocked Category' } };

  beforeEach(() => {
    navigateSpy = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateSpy);

    createCategorySpy = jest.fn();
    setCategorySpy = jest.fn();
    toggleIsActiveSpy = jest.fn();

    useStatefulRecoil = jest
      .spyOn(useStatefulRecoilModule as any, 'useStatefulRecoil')
      .mockReturnValue({
        state: mockState,
        useCase: {
          createCategory: createCategorySpy,
          setCategory: setCategorySpy,
          toggleIsActive: toggleIsActiveSpy,
        },
      });
  });

  test('renders the "Create Category" page', () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <CreateCategoryPage />
        </BrowserRouter>
      </RecoilRoot>,
    );

    const titleElement = screen.getByText('Create Category');
    expect(titleElement).toBeInTheDocument();
  });

  test('should correctly call useNavigate', () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <CreateCategoryPage />
        </BrowserRouter>
      </RecoilRoot>,
    );

    expect(useNavigate).toHaveBeenCalledTimes(1);
    expect(useNavigate).toHaveBeenCalledWith();
  });

  test('should call navigate and onSubmit when handleSubmit returned by useFormState hook is called', () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <CreateCategoryPage />
        </BrowserRouter>
      </RecoilRoot>,
    );

    const formSubmitButton = screen.getByText('submit');
    fireEvent.click(formSubmitButton);

    expect(createCategorySpy).toHaveBeenCalledTimes(1);
    expect(createCategorySpy).toHaveBeenCalledWith();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/categories');
  });

  test('passes the correct props to the Form component', () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <CreateCategoryPage />
        </BrowserRouter>
      </RecoilRoot>,
    );

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
