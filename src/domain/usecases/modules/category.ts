import { api } from '../../api';
import { Category } from '../../models/category';
import { StatefulUseCase } from '../stateful-usecase';

export type State = {
  categories: Category[];
  filteredCategories: Category[];
  category: Partial<Category>;
};

export const DEFAULT_STATE: State = {
  categories: [],
  filteredCategories: [],
  category: {
    name: '',
    description: '',
    is_active: true,
  } as Partial<Category>,
};

export class CategoryUseCase extends StatefulUseCase<State> {
  public init = async () => {
    await this.initCategories();
  };

  initCategories = async () => {
    console.log('initCategories');
    const { data } = await api.get('/categories');
    this.loadCategories(data);
  };

  filterCategories = (search: string | undefined) => {
    const categories = this.getState().categories;
    if (!search) {
      this.setState({ filteredCategories: categories });
      return;
    }
    const filteredCategories = categories.filter((category) => {
      return category.name.toLowerCase().includes(search.toLowerCase());
    });
    this.setState({ filteredCategories });
  };

  setCategory = ({ name, value }: { name: 'name' | 'description'; value: string }) => {
    this.setState({
      category: {
        ...this.getState().category,
        [name]: value,
      },
    });
    // console.log(this.getState().category);

    // console.log({
    //   ...this.state.category,
    //   [name]: value,
    // });

    // this.setState(
    //   {
    //     category: {
    //       ...this.getState().category,
    //       [name]: value,
    //     },
    //   },
    //   () => {
    //     console.log(this.getState().category);
    //   },
    // );
  };

  toggleIsActive = () => {
    this.setState(
      {
        category: {
          ...this.getState().category,
          is_active: !this.getState().category.is_active,
        },
      },
      () => {
        console.log(this.getState().category);
      },
    );
  };

  createCategory = async () => {
    const fmtCategory: Partial<Category> = {
      ...this.getState().category,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      deleted_at: null,
    };
    const { data: newCategory } = await api.post('/categories', fmtCategory);
    this.setState({ categories: [...this.state.categories, newCategory] });
  };

  updateCategory = async (category: Partial<Category>) => {
    const fmtCategory: Partial<Category> = {
      ...category,
      updated_at: new Date().toString(),
    };
    const { data: updatedCategory } = await api.put(`/categories/${category.id}`, fmtCategory);
    const categories = this.state.categories.map((category) => {
      if (category.id === updatedCategory.id) {
        return updatedCategory;
      }
      return category;
    });
    this.setState({ categories });
  };

  deleteCategory = async (id: string) => {
    const categories = this.getState().categories;
    const category = categories.find((category) => category.id === id);
    if (!category) {
      throw new Error('Category not found');
    }
    const fmtCategory: Category = {
      ...category,
      deleted_at: new Date().toString(),
    };
    await api.put(`/categories/${id}`, fmtCategory);
    const fmrCategories = categories.map((category) => {
      if (category.id === id) {
        return fmtCategory;
      }
      return category;
    });
    this.loadCategories(fmrCategories);
  };

  private loadCategories = (c: Category[]) => {
    const categories = c.filter((c: Category) => !c.deleted_at);
    this.setState({ categories, filteredCategories: categories });
  };
}
