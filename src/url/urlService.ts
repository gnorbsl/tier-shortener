import {DBUrl} from '../db/dbService'
import {IUrl} from "./types/IUrl";
import { nanoid } from 'nanoid'

export class UrlService {
    private hashSize: number;

    constructor() {
        this.hashSize = process.env.HASH_SIZE?parseInt(process.env.HASH_SIZE):5
    }

    /**
     * Returns an originalUrl connected to a shortUrl
     *
     * @param {string} hash shortened Url
     */
    public async getOriginalUrl(hash: string): Promise<IUrl|null>{

        return await DBUrl.findUnique({
            select: {
                url: true,
                createdAt: true
            },
            where: {
                hash
            }
        })
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
                hash: true
            },
            data: {
                url,
                hash
            }
        })
    }

    /**
     * Generate hashes until an unused hash is found if an existing hash is found 3 times increase hashsize
     * This might cause concurrency issues in very rare cases, but for this project i'll ignore them
     * Also might be useful to increase size permanently in the .env
     *
     * @returns {string} hash
     */
    private async generateUniqueHash(): Promise<string> {

        let hash: string = '';
        let dbEntry = null;
        let tries = 1;

        do {
            if (tries >= 3) {
                this.hashSize++;
                tries = 0;
            }
            //generate hash and replace characters that can be hard to distinguish depending on font
            //like lowercase L and 1 and zero and uppercase o
                nanoid(this.hashSize)
                .replace('l', 'x')
                .replace('0', 'y')

            dbEntry = await this.getOriginalUrl(hash)

            tries++;

        } while (dbEntry)

        return hash;
    }
}