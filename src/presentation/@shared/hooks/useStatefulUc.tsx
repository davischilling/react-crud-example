import { useEffect, useRef } from 'react';
import {
  SetState,
  StateCallback,
  StatefulUseCase,
} from '../../../domain/usecases/stateful-usecase';

type StateFulContextUseCaseProps<State, UseCaseClass extends StatefulUseCase<State>> = {
  UseCase: new (state: State, setStateCb: SetState<State>) => UseCaseClass;
  store: () => [State, (value: Partial<State>) => void];
  INITIAL_STATE?: Partial<State>;
};

export function useStatefulUseCase<State, UseCaseClass extends StatefulUseCase<State>>({
  UseCase,
  INITIAL_STATE,
  store,
}: StateFulContextUseCaseProps<State, UseCaseClass>) {
  const [logicState, setLogicState] = store();
  const useCaseLogicRef = useRef<UseCaseClass>();

  useEffect(() => {
    const setState = (newState: any, cb?: StateCallback) => {
      setLogicState(Object.assign({}, logicState, newState));
      cb && cb();
    };

    useCaseLogicRef.current = new UseCase(logicState, (newState, cb) => {
      setState(newState, cb);
    });

    useCaseLogicRef.current.init();
  }, [logicState]);

  return { state: logicState, useCase: useCaseLogicRef.current };
}
