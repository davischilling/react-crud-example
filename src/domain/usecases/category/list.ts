import { api } from '../../api';
import { Category } from '../../models/category';
import { StatefulUseCase } from '../stateful-usecase';

export type State = {
  isLoading: boolean;
  categories: Category[];
  filteredCategories: Category[];
};

export const DEFAULT_STATE: State = {
  isLoading: true,
  categories: [],
  filteredCategories: [],
};

export class ListCategoriesUseCase extends StatefulUseCase<State> {
  public init = async () => {
    await this.initCategories();
  };

  initCategories = async () => {
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
      return (
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.description?.toLowerCase().includes(search.toLowerCase())
      );
    });
    this.setState({ filteredCategories });
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

  private loadCategories = (c: Category[], cb?: () => void) => {
    const categories = c.filter((c: Category) => !c.deleted_at);
    this.setState({ categories, filteredCategories: categories }, () => {
      cb && cb();
      this.setState({ isLoading: false });
    });
  };
}
