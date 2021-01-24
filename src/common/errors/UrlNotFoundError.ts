export default class UrlNotFoundError extends Error {
  public status: number;

  public name: string;

  constructor() {
    super('No url with provided hash found');
    this.status = 404;
    this.name = 'UrlNotFound';
  }
}
