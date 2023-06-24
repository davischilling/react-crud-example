import { useEffect, useState } from 'react';
import { RecoilState, useRecoilState } from 'recoil';
import { SetState, StatefulUseCase } from '../../../domain/usecases/stateful-usecase';

type UseCaseRecoilState<State, UseCaseClass extends StatefulUseCase<State>> = {
  UseCase: new (state: State, setStateCb: SetState<State>) => UseCaseClass;
  recoilState: RecoilState<State>;
  INITIAL_STATE?: Partial<State>;
};

export function useStatefulRecoil<State, UseCaseClass extends StatefulUseCase<State>>({
  UseCase,
  recoilState,
  INITIAL_STATE,
}: UseCaseRecoilState<State, UseCaseClass>) {
  const [logicState, setLogicState] = useRecoilState(recoilState);
  const [useCase] = useState<UseCaseClass>(
    () =>
      new UseCase(logicState, async (newState, cb) => {
        setLogicState((oldState) => Object.assign({}, oldState, newState));
        cb && (await cb());
      }),
  );

  useEffect(() => {
    return () => {
      useCase.init(INITIAL_STATE);
    };
  }, [useCase]);

  return { state: logicState, useCase };
}

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
