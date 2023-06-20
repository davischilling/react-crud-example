import { Category } from '../../models/category';
import { StatefulUseCase } from '../stateful-usecase';

export type State = {
  categories: Category[];
};

export const DEFAULT_STATE: State = {
  categories: [
    {
      id: '1',
      name: 'Category 1',
      description: 'Category 1 description',
      created_at: new Date().toLocaleDateString('pt-BR'),
      updated_at: new Date().toLocaleDateString('pt-BR'),
      deleted_at: null,
      is_active: true,
    },
  ],
};

export class CategoryUseCase extends StatefulUseCase<State> {
  public init = async () => {};
}
