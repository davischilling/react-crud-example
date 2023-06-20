import React from 'react';
import { StatefulUseCase } from '../../../domain/usecases/stateful-usecase';
import createGenericContext from '../contexts/createGenericContext';
import { useStatefulUseCase } from './useStatefulUc';

type ModuleWrapperProps<State, UseCase extends StatefulUseCase<State>> = {
  DEFAULT_STATE: State;
  UseCase: new (
    state: State,
    setStateCb: (value: Partial<State>, cb?: () => void) => void,
  ) => UseCase;
};

export function useModuleWrapper<State, UseCase extends StatefulUseCase<State>>({
  DEFAULT_STATE,
  UseCase,
}: ModuleWrapperProps<State, UseCase>) {
  const { Provider, useStore } = createGenericContext<State>(DEFAULT_STATE);
  const useModuleStore = () => useStore<State>((store) => store);
  const useModuleUseCase = () =>
    useStatefulUseCase<State, UseCase>({
      UseCase,
      store: useModuleStore,
    });
  return { Provider, useModuleUseCase };
}
