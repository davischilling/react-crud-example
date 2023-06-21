import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  SetState,
  StateCallback,
  StatefulUseCase,
} from '../../../domain/usecases/stateful-usecase';

type StateFulUseCaseProps<State, UseCaseClass extends StatefulUseCase<State>> = {
  UseCase: new (state: State, setStateCb: SetState<State>) => UseCaseClass;
  DEFAULT_STATE: State;
  INITIAL_STATE?: Partial<State>;
};

function useCallbackRef<T = () => void>(callback: T) {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  return callbackRef;
}

export function useStatefulUseCase<State, UseCaseClass extends StatefulUseCase<State>>({
  UseCase,
  DEFAULT_STATE,
  INITIAL_STATE = {},
}: StateFulUseCaseProps<State, UseCaseClass>) {
  const [logicState, setLogicState] = useState<State>(
    Object.assign({}, DEFAULT_STATE, INITIAL_STATE),
  );
  const setState = (newState: any, cb?: StateCallback) => {
    setLogicState((oldState) => Object.assign({}, oldState, newState));
    cb && cb();
  };

  const [useCase] = useState<UseCaseClass>(
    new UseCase(logicState, (newState, cb) => {
      setState(newState, cb);
    }),
  );

  useEffect(() => {
    return () => {
      useCase.init();
    };
  }, []);

  return { state: logicState, useCase };
}
