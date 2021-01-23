import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  Request,
  SuccessResponse,
} from 'tsoa';
import express from 'express';
import UrlService from './urlService';
import IJsonResponse from '../common/types/IJsonResponse';

@Route('')
// has to be surpressed because of tsoa
// eslint-disable-next-line import/prefer-default-export
export class UrlController extends Controller {
  /**
   * route to convert shortened url hash to original url
   *
   * @param req express request
   * @param hash
   */
  @Get('{hash}')
  public async getOriginalUrl(
    @Request() req: express.Request, @Path() hash: string,
  ): Promise<IJsonResponse> {
    const url = await UrlService.getUrlByHash(hash, req.clientIp);
    if (!url) {
      this.setStatus(404);
      return { success: false, error: 'No url with this hash found' };
    }
    return { success: true, data: url };
  }

  /**
   * route to create a short url
   * @body {string} url
   */
  @SuccessResponse('201', 'Created')
  @Post()
  public async createShortUrl(@Body() body: { url: string }): Promise<IJsonResponse> {
    const { url } = body;
    // could probably have some validation to check for valid urls
    // but thats a lot more complex than it seems apparently
    const shortenedUrl = await new UrlService().createShortUrl(url);
    if (!shortenedUrl) {
      this.setStatus(500);
      return { success: false, error: 'Error while creating short url, please try again' };
    }
    if (process.env.BASE_URL) {
      return { success: true, data: process.env.BASE_URL + shortenedUrl.hash };
    }
    throw Error('BASE_URL is empty');
  }
}
