import { nanoid } from 'nanoid';
import { createHash } from 'crypto';
import { DBUrl, DBStats } from '../db/dbService';
import { IUrl } from './types/IUrl';

class UrlService {
  private hashSize: number;

  constructor() {
    this.hashSize = process.env.HASH_SIZE ? parseInt(process.env.HASH_SIZE, 10) : 5;
  }

  /**
   * Returns an originalUrl connected to a shortUrl
   *
   * @param {string} hash shortened Url
   * @param clientIp ip of stats
   */
  public static async getUrlByHash(hash: string, clientIp?: string): Promise<IUrl | null> {
    const url = await DBUrl.findUnique({
      select: {
        id: true,
        url: true,
        createdAt: true,
      },
      where: {
        hash,
      },
    });

    // save stats
    if (url && clientIp) {
      await DBStats.create({
        data: {
          ipHash: createHash('md5').update(clientIp).digest('hex'),
          urlId: url.id,
        },
      });
    }

    return url;
  }

  /**
     * Creates a shortened URL, stores in the DB and returns the Object
     *
     * @param {string} url, to be shortened url
     */
  public async createShortUrl(url: string): Promise<IUrl> {
    const hash = await this.generateUniqueHash();
    return DBUrl.create({
      select: {
        url: true,
        hash: true,
      },
      data: {
        url,
        hash,
      },
    });
  }

  /**
     * Generate hashes until an unused hash is found
     * if an existing hash is found 3 times increase hashsize
     * This might cause concurrency issues in very rare cases, but for this project i'll ignore them
     * Also might be useful to increase size permanently in the .env
     *
     * @returns {string} hash
     */
  private async generateUniqueHash(): Promise<string> {
    let hash = '';
    let dbEntry = null;
    let tries = 0;

    // a do/while in the wild! Using it feels dirty but I think it's a good choice for this task
    do {
      if (tries >= 3) {
        this.hashSize += 1;
        tries = 0;
      }
      // generate hash and replace characters that can be hard to distinguish depending on font
      // like lowercase L and 1 and zero and uppercase o
      hash = nanoid(this.hashSize)
        .replace('l', 'x')
        .replace('0', 'y');

      // check if a db entry already exists with that hash
      // this could probably also done with mysql and unique errors and some kind of retry
      // eslint-disable-next-line no-await-in-loop
      dbEntry = await UrlService.getUrlByHash(hash);

      tries += 1;
    } while (dbEntry);

    return hash;
  }
}

export default UrlService;
