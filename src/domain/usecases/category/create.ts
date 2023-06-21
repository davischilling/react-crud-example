import { api } from '../../api';
import { Category } from '../../models/category';
import { StatefulUseCase } from '../stateful-usecase';

export type State = {
  category: Partial<Category>;
};

export const DEFAULT_STATE: State = {
  category: {
    name: '',
    description: '',
    is_active: true,
  } as Partial<Category>,
};

export class CreateCategoryUseCase extends StatefulUseCase<State> {
  setCategory = ({ name, value }: { name: 'name' | 'description'; value: string }) => {
    console.log('setCategory');

    this.setState({
      category: {
        ...this.state.category,
        [name]: value,
      },
    });
  };

  toggleIsActive = () => {
    this.setState({
      category: {
        ...this.state.category,
        is_active: !this.state.category.is_active,
      },
    });
  };

  createCategory = async () => {
    const fmtCategory: Partial<Category> = {
      ...this.getState().category,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      deleted_at: null,
    };
    await api.post('/categories', fmtCategory);
  };
}
