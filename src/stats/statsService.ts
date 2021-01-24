import { prisma } from '../db/dbService';
import UrlService from '../url/urlService';
import UrlNotFoundError from '../common/errors/UrlNotFoundError';

class StatsService {
  /**
   * returns visitor stats for a specific hash
   *
   * @param hash
   */
  public static async getStatisticsForHash(hash: string): Promise<string> {
    const url = await UrlService.getUrlByHash(hash);
    if (!url) { throw new UrlNotFoundError(); }

    const [stats]: string = await prisma.$queryRaw`
        select 
          count(id) as totalVisits, 
          count(distinct ipHash) as uniqueVisits 
        from Stats 
        where urlId = ${url.id}`;
    return stats;
  }
}

export default StatsService;
