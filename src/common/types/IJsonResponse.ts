import { IUrl } from '../../url/types/IUrl';

export default interface IJsonResponse {
  error?: string,
  success: boolean,
  data?: IUrl|string|null
}
