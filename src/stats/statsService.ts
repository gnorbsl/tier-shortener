import { prisma } from '../db/dbService';
import UrlService from '../url/urlService';

class StatsService {
  public static async getStatisticsForHash(hash: string): Promise<string|undefined> {
    const url = await UrlService.getUrlByHash(hash);
    if (url) {
      const stats: string[] = await prisma.$queryRaw`
        select 
          count(id) as totalVisits, 
          count(distinct ipHash) as uniqueVisits 
        from Stats 
        where urlId = ${url.id}`;
      return stats[0];
    }

    return undefined;
  }
}

export default StatsService;
