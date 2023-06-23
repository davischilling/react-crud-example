import { api } from '../../../src/domain/api';
import { ValidationError } from '../../../src/domain/errors/validation-error';
import {
  CreateCategoryUseCase,
  DEFAULT_STATE,
  State,
} from '../../../src/domain/usecases/category/create';
import { makeStatefulUseCase } from '../../utils/make-sut';

jest.mock('../../../src/domain/api');

const makeSut = async (init: boolean = true) => {
  return await makeStatefulUseCase<State, CreateCategoryUseCase>(
    CreateCategoryUseCase,
    DEFAULT_STATE,
    init,
  );
};

describe('CreateCategoryUseCase', () => {
  let postMock: jest.SpyInstance;

  beforeEach(async () => {
    jest.clearAllMocks();
    postMock = jest.spyOn(api, 'post');
  });

  describe('setCategory', () => {
    it('should update the category state', async () => {
      const useCase = await makeSut();
      const mockCategory = {
        name: 'Category 1',
        description: 'Description 1',
      };

      useCase.setCategory({ name: 'name', value: mockCategory.name });
      useCase.setCategory({ name: 'description', value: mockCategory.description });

      expect(useCase.getState().category).toStrictEqual({ ...mockCategory, is_active: true });
    });

    it('should not update the category state if the name is invalid and throw', async () => {
      const useCase = await makeSut();
      const mockCategory = {
        name: 'Category 1',
        description: 'Description 1',
      };

      useCase.setCategory({ name: 'name', value: mockCategory.name });
      useCase.setCategory({ name: 'description', value: mockCategory.description });
      expect(() => {
        useCase.setCategory({ name: 'invalid' as any, value: 'invalid' });
      }).toThrow(new ValidationError('Invalid attribute type: invalid'));
      expect(useCase.getState().category).toStrictEqual({ ...mockCategory, is_active: true });
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

  describe('createCategory', () => {
    test('calls api.post with the correct arguments', async () => {
      const useCase = await makeSut();
      await useCase.createCategory();

      expect(postMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledWith(
        '/categories',
        expect.objectContaining({
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
        }),
      );
    });
  });
});
