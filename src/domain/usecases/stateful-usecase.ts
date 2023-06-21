export type StateCallback = () => void;
export type SetState<T> = (newState: Partial<T>, cb?: StateCallback) => void;

export abstract class StatefulUseCase<State> {
  protected state: State;
  protected setState: SetState<State>;
  static counter = 0;

  constructor(state: State, setStateCb: SetState<State>) {
    this.state = state;
    this.setState = (newState, cb) => {
      this.state = Object.assign({}, this.state, newState);
      setStateCb(newState, cb);
    };
    StatefulUseCase.counter++;
  }

  public getState(): State {
    return this.state;
  }

  abstract init: () => Promise<void>;
}
