import { api } from '../../../src/domain/api';
import { NotFoundError } from '../../../src/domain/errors/not-found-error';
import { ValidationError } from '../../../src/domain/errors/validation-error';
import { Category } from '../../../src/domain/models/category';
import {
  EditCategoryUseCase,
  DEFAULT_STATE,
  State,
} from '../../../src/domain/usecases/category/edit';
import { makeStatefulUseCase } from '../../utils/make-sut';

jest.mock('../../../src/domain/api');

const makeSut = async (init: boolean = true, state?: Partial<State>) => {
  return await makeStatefulUseCase<State, EditCategoryUseCase>(
    EditCategoryUseCase,
    { ...DEFAULT_STATE, ...state },
    init,
  );
};

describe('EditCategoryUseCase', () => {
  let putMock: jest.SpyInstance;
  let getMock: jest.SpyInstance;
  let mockedCategory: Category;
  const date = new Date().toString();

  beforeEach(async () => {
    jest.clearAllMocks();
    mockedCategory = {
      id: '1',
      name: 'Category 1',
      description: 'Description 1',
      is_active: true,
      created_at: date,
      updated_at: date,
      deleted_at: null,
    };
    putMock = jest.spyOn(api, 'put');
    getMock = jest.spyOn(api, 'get').mockResolvedValue({
      data: mockedCategory,
    });
  });

  describe('initCategory', () => {
    it('should load category from the API and update the state', async () => {
      let useCase = await makeSut(false, { category: { id: '1' } });
      const initCategorySpy = jest.spyOn(useCase as any, 'initCategory');

      await useCase.init();

      expect(initCategorySpy).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledWith('/categories/1');
    });

    it('should throw NotFoundError if api.get data returns null', async () => {
      let useCase = await makeSut(false);
      getMock.mockResolvedValueOnce({ data: null });

      await expect(useCase.init()).rejects.toThrow(new NotFoundError('Category'));
    });
  });

  describe('setCategory', () => {
    it('should update the category state', async () => {
      const useCase = await makeSut();

      expect(useCase.getState().category).toStrictEqual(mockedCategory);

      useCase.setCategory({ name: 'name', value: 'edited cat' });
      useCase.setCategory({ name: 'description', value: 'edit desc' });

      expect(useCase.getState().category).toStrictEqual({
        ...mockedCategory,
        name: 'edited cat',
        description: 'edit desc',
      });
    });

    it('should not update the category state if the name is invalid and throw', async () => {
      const useCase = await makeSut();
      expect(() => {
        useCase.setCategory({ name: 'invalid' as any, value: 'invalid' });
      }).toThrow(new ValidationError('Invalid attribute type: invalid'));
      expect(useCase.getState().category).toStrictEqual(mockedCategory);
    });
  });

  describe('toggleIsActive', () => {
    it('should toggle the is_active state', async () => {
      const useCase = await makeSut();
      useCase.toggleIsActive();
      expect(useCase.getState().category).toStrictEqual(
        expect.objectContaining({ is_active: false }),
      );
      useCase.toggleIsActive();
      expect(useCase.getState().category).toStrictEqual(
        expect.objectContaining({ is_active: true }),
      );
    });
  });

  describe('updateCategory', () => {
    test('calls api.put with the correct arguments', async () => {
      const useCase = await makeSut();
      await useCase.updateCategory();

      const { updated_at, ...updatedCategory } = mockedCategory;
      expect(putMock).toHaveBeenCalledTimes(1);
      expect(putMock).toHaveBeenCalledWith(
        '/categories/1',
        expect.objectContaining(updatedCategory),
      );
    });
  });
});
