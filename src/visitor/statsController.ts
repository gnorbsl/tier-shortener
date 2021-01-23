import {
  Get, Path, Route,
} from 'tsoa';
import { Controller } from '@tsoa/runtime';
import IJsonResponse from '../common/types/IJsonResponse';
import StatsService from './statsService';

@Route('stats')
// eslint-disable-next-line import/prefer-default-export
export class StatsController extends Controller {
  /**
     * route get visitor statistics for a specific hash
     *
     * @param hash
     */
  @Get('{hash}')
  public async getUrlStatistics(
    @Path() hash: string,
  ): Promise<IJsonResponse> {
    const stats = await StatsService.getStatisticsForHash(hash);
    if (!stats) {
      this.setStatus(404);
      return { success: false, error: 'No url with this hash found' };
    }
    return { success: true, data: stats };
  }
}
