import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  SetState,
  StateCallback,
  StatefulUseCase,
} from '../../../domain/usecases/stateful-usecase';

type StateFulContextUseCaseProps<State, UseCaseClass extends StatefulUseCase<State>> = {
  UseCase: new (state: State, setStateCb: SetState<State>) => UseCaseClass;
  store: () => [State, (value: Partial<State>) => void];
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
  store,
}: StateFulContextUseCaseProps<State, UseCaseClass>) {
  const [logicState, setLogicState] = store();

  const setState = useCallback(
    (newState: any, cb?: StateCallback) => {
      setLogicState(Object.assign({}, logicState, newState));
      cb && cb();
    },
    [logicState, setLogicState],
  );

  console.log('rendering useStatefulUseCase');

  const useCaseLogicRef = useCallbackRef<UseCaseClass>(
    new UseCase(logicState, (newState, cb) => {
      setState(newState, cb);
    }),
  );

  useEffect(() => {
    return () => {
      useCaseLogicRef.current.init();
    };
  }, []);

  return { state: logicState, useCase: useCaseLogicRef.current };
}
