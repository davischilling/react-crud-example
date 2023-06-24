import { SetState, StatefulUseCase } from '../../src/domain/usecases/stateful-usecase';

export async function makeStatefulUseCase<State, UseCaseClass extends StatefulUseCase<State>>(
  UseCase: new (state: State, setStateCb: SetState<State>) => UseCaseClass,
  defaultState: State,
  init: boolean = true,
) {
  let state: State = Object.assign({}, defaultState);
  const useCase: UseCaseClass = new UseCase(state, async (newState, cb) => {
    state = { ...state, ...newState };
    cb && (await cb());
  });
  init && (await useCase.init());
  return useCase;
}
