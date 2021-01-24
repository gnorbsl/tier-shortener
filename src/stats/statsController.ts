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
     * route get stats statistics for a specific hash
     *
     * @param {string} hash
     */
  @Get('/{hash}')
  public async getUrlStatistics(
    @Path() hash: string,
  ): Promise<IJsonResponse> {
    return { success: true, data: await StatsService.getStatisticsForHash(hash) };
  }
}
