export class NotFoundError extends Error {
  public readonly message: string;

  constructor(entityName: string) {
    super(entityName);
    this.message = `${entityName} not found`;
  }
}
