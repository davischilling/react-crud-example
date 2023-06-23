import { StatefulUseCase } from '../../src/domain/usecases/stateful-usecase';
import { makeStatefulUseCase } from './make-sut';

type State = {};

class UseCaseStub extends StatefulUseCase<State> {
  static initCounter: number = 0;

  init = async () => {
    UseCaseStub.initCounter++;
  };
}

let makeSut = async (init: boolean = true) => {
  return await makeStatefulUseCase<State, UseCaseStub>(UseCaseStub, {}, init);
};

describe('first', () => {
  beforeEach(() => {
    UseCaseStub.initCounter = 0;
  });

  it('should not call init if false', async () => {
    let useCase = await makeSut(false);
    let initSpy = jest.spyOn(useCase, 'init');
    expect(initSpy).not.toHaveBeenCalled();
    await useCase.init();
    expect(initSpy).toHaveBeenCalled();
  });

  it('should not call init if true', async () => {
    let useCase = await makeSut();
    expect(UseCaseStub.initCounter).toBe(1);
    await useCase.init();
    expect(UseCaseStub.initCounter).toBe(2);
  });
});
