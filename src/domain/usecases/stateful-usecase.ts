export type StateCallback = () => void;
export type SetState<T = any> = (newState: Partial<T>, cb?: StateCallback) => void;

export class StatefulUseCase<State> {
  protected state: State;
  protected setState: SetState<State>;
  static counter: number = 0;

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

  public async init(): Promise<void> {}
}
