import { CategoryUseCase, DEFAULT_STATE, State } from '../../../domain/usecases/modules/category';
import { useModuleWrapper } from '../../@shared/hooks/useModuleWrapper';

const { Provider: CategoryProvider, useModuleUseCase: useCategoryUseCase } = useModuleWrapper<
  State,
  CategoryUseCase
>({
  DEFAULT_STATE,
  UseCase: CategoryUseCase,
});

export { CategoryProvider, useCategoryUseCase };
