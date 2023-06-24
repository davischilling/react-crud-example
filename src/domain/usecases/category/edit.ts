import { api } from '../../api';
import { NotFoundError } from '../../errors/not-found-error';
import { ValidationError } from '../../errors/validation-error';
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
  public init = async (INITIAL_STATE?: Partial<State>) => {
    this.setState(
      {
        category: {
          ...DEFAULT_STATE.category,
          id: INITIAL_STATE?.category?.id,
        },
      },
      async () => await this.initCategory(),
    );
  };

  private initCategory = async () => {
    try {
      const { data } = await api.get(`/categories/${this.state.category.id}`);
      this.setState({ category: data, isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  setCategory = ({ name, value }: { name: 'name' | 'description'; value: string }) => {
    if (!['name', 'description'].includes(name)) {
      throw new ValidationError(`Invalid attribute type: ${name}`);
    }
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
