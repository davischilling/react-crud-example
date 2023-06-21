import { renderHook, act, waitFor } from '@testing-library/react';
import { StatefulUseCase } from '../../../../src/domain/usecases/stateful-usecase';
import { useStatefulUseCase } from '../../../../src/presentation/@shared/hooks/useStatefulUc';

type MockState = {
  value: number;
};

// Create a mock implementation of the StatefulUseCase
class MockUseCase extends StatefulUseCase<MockState> {
  init = async () => {
    console.log('init CreateCategoryUseCase');
  };

  updateValue = (value: number) => {
    this.setState({ value });
  };
}

describe('useStatefulUseCase', () => {
  it('should initialize the state correctly', () => {
    const DEFAULT_STATE = { value: 0 };
    const INITIAL_STATE = { value: 5 };
    const { result } = renderHook(() =>
      useStatefulUseCase({
        UseCase: MockUseCase,
        DEFAULT_STATE,
        INITIAL_STATE,
      }),
    );

    const { state } = result.current;
    expect(state).toStrictEqual({ value: 5 });
  });

  it('should update the state correctly when setState is called', async () => {
    const DEFAULT_STATE = { value: 0 };
    const { result } = renderHook(() =>
      useStatefulUseCase({
        UseCase: MockUseCase,
        DEFAULT_STATE,
      }),
    );
    const { state, useCase } = result.current;
    expect(state).toEqual({ value: 0 });

    act(() => {
      useCase.updateValue(10);
    });

    await waitFor(() => {
      expect(result.current.state).toEqual({ value: 10 });
    });
  });

  it('should call the useCase init method on unmount', () => {
    const DEFAULT_STATE = { value: 0 };
    const { result, unmount } = renderHook(() =>
      useStatefulUseCase({
        UseCase: MockUseCase,
        DEFAULT_STATE,
      }),
    );

    const { useCase } = result.current;

    jest.spyOn(useCase, 'init');
    unmount();

    expect(useCase.init).toHaveBeenCalled();
  });
});
