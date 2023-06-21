import { useEffect, useState } from 'react';

import {
  SetState,
  StateCallback,
  StatefulUseCase,
} from '../../../domain/usecases/stateful-usecase';

type StatefulUseCaseProps<State, UseCaseClass extends StatefulUseCase<State>> = {
  UseCase: new (state: State, setStateCb: SetState<State>) => UseCaseClass;
  DEFAULT_STATE: State;
  INITIAL_STATE?: Partial<State>;
};

export function useStatefulUseCase<State, UseCaseClass extends StatefulUseCase<State>>({
  UseCase,
  DEFAULT_STATE,
  INITIAL_STATE = {},
}: StatefulUseCaseProps<State, UseCaseClass>) {
  const [logicState, setLogicState] = useState<State>(
    Object.assign({}, DEFAULT_STATE, INITIAL_STATE),
  );

  const [useCase] = useState<UseCaseClass>(
    () =>
      new UseCase(logicState, (newState, cb) => {
        setLogicState((oldState) => Object.assign({}, oldState, newState));
        cb && cb();
      }),
  );

  useEffect(() => {
    return () => {
      useCase.init();
    };
  }, [useCase]);

  return { state: logicState, useCase };
}
