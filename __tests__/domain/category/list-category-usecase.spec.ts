import { api } from '../../../src/domain/api';
import { NotFoundError } from '../../../src/domain/errors/not-found-error';
import { Category } from '../../../src/domain/models/category';
import {
  DEFAULT_STATE,
  ListCategoriesUseCase,
  State,
} from '../../../src/domain/usecases/category/list';
import { makeStatefulUseCase } from '../../utils/make-sut';

jest.mock('../../../src/domain/api');

const makeSut = async (init: boolean = true) => {
  return await makeStatefulUseCase<State, ListCategoriesUseCase>(
    ListCategoriesUseCase,
    DEFAULT_STATE,
    init,
  );
};

describe('ListCategoriesUseCase', () => {
  let getMock: jest.SpyInstance;
  let putMock: jest.SpyInstance;

  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'Category 1',
      description: 'Description 1',
      is_active: true,
      created_at: '',
      updated_at: '',
      deleted_at: '',
    },
    {
      id: '2',
      name: 'Category 2',
      description: 'Description 2',
      is_active: true,
      created_at: '',
      updated_at: '',
      deleted_at: '',
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();
    getMock = jest.spyOn(api, 'get').mockResolvedValue({ data: mockCategories });
    putMock = jest.spyOn(api, 'put');
  });

  describe('initCategories', () => {
    it('should load categories from the API and update the state', async () => {
      let useCase = await makeSut();
      const mockData = [{ id: '1', name: 'Category 1' }];
      getMock.mockResolvedValueOnce({ data: mockData });

      await useCase.initCategories();

      expect(getMock).toHaveBeenCalledWith('/categories');
      expect(useCase.getState().categories).toEqual(mockData);
      expect(useCase.getState().filteredCategories).toEqual(mockData);
    });
  });

  describe('filterCategories', () => {
    it('should update the filteredCategories based on the search term', async () => {
      let useCase = await makeSut();
      // Test initial state
      expect(useCase.getState().filteredCategories.length).toBe(2);
      // Test filtering by name
      useCase.filterCategories('Category 1');
      expect(useCase.getState().filteredCategories.length).toBe(1);
      expect(useCase.getState().filteredCategories[0].name).toBe('Category 1');
      // Test filtering by description
      useCase.filterCategories('Description 2');
      expect(useCase.getState().filteredCategories.length).toBe(1);
      expect(useCase.getState().filteredCategories[0].description).toBe('Description 2');
      // Test empty search term
      useCase.filterCategories('');
      expect(useCase.getState().filteredCategories.length).toBe(2);
      expect(useCase.getState().filteredCategories[0].name).toBe('Category 1');
      expect(useCase.getState().filteredCategories[1].name).toBe('Category 2');
      // Test random search term
      useCase.filterCategories('random');
      expect(useCase.getState().filteredCategories.length).toBe(0);
    });
  });

  describe('deleteCategory', () => {
    it('should delete the category, update the state, and make an API request', async () => {
      let useCase = await makeSut(false);
      let loadCategoriesSpy = jest.spyOn(useCase as any, 'loadCategories');

      await useCase.init();
      // Test initial state
      expect(useCase.getState().categories.length).toBe(2);
      expect(useCase.getState().filteredCategories.length).toBe(2);
      expect(useCase.getState().categories[0].deleted_at).toBeFalsy();
      expect(useCase.getState().filteredCategories[0].deleted_at).toBeFalsy();
      expect(loadCategoriesSpy).toHaveBeenCalledTimes(1);

      await useCase.deleteCategory('1');
      const { deleted_at, ...deletedCategory } = mockCategories[0];

      expect(putMock).toHaveBeenCalledTimes(1);
      expect(putMock).toHaveBeenCalledWith(
        '/categories/1',
        expect.objectContaining(deletedCategory),
      );
      expect(loadCategoriesSpy).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if the category to delete is not found', async () => {
      let useCase = await makeSut();
      await expect(useCase.deleteCategory('nonexistent-id')).rejects.toThrow(
        new NotFoundError('Category'),
      );
      expect(api.put).not.toHaveBeenCalled();
      expect(useCase.getState().categories).toEqual(mockCategories);
      expect(useCase.getState().filteredCategories).toEqual(mockCategories);
    });
  });

  describe('loadCategories', () => {
    it('should update the state with the categories passed', async () => {
      let useCase = await makeSut(false);
      const mockData = [{ id: '1', name: 'Category 1' }];
      await (useCase as any).loadCategories(mockData);
      expect(useCase.getState().categories).toEqual(mockData);
      expect(useCase.getState().filteredCategories).toEqual(mockData);
    });
  });
});
