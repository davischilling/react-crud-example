import { api } from '../../api';
import { Category } from '../../models/category';
import { StatefulUseCase } from '../stateful-usecase';

export type State = {
  isLoading: boolean;
  category: Partial<Category>;
};

export const DEFAULT_STATE: State = {
  isLoading: true,
  category: {
    name: '',
    description: '',
    is_active: true,
  } as Partial<Category>,
};

export class EditCategoryUseCase extends StatefulUseCase<State> {
  public init = async () => {
    await this.initCategory();
  };

  initCategory = async () => {
    const { data } = await api.get(`/categories/${this.state.category.id}`);
    this.setState({ category: data, isLoading: false });
  };

  setCategory = ({ name, value }: { name: 'name' | 'description'; value: string }) => {
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

  updateCategory = async () => {
    const fmtCategory: Partial<Category> = {
      ...this.state.category,
      updated_at: new Date().toString(),
    };
    await api.put(`/categories/${this.state.category.id}`, fmtCategory);
  };
}
