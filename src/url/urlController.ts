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
   * @param {string} hash
   */
  @Get('/{hash}')
  public async getOriginalUrl(
    @Request() req: express.Request, @Path() hash: string,
  ): Promise<IJsonResponse> {
    return { success: true, data: await UrlService.getUrlByHash(hash, req.clientIp) };
  }

  /**
   * route to create a shortened url
   * @body {string} url
   */

  @SuccessResponse('201', 'Created')
  @Post('/')
  public async createShortUrl(@Body() body: { url: string }): Promise<IJsonResponse> {
    const { url } = body;
    // could probably have some validation to check for valid urls
    // but thats a lot more complex than it seems apparently
    const shortenedUrl = await new UrlService().createShortUrl(url);

    if (!process.env.BASE_URL) {
      throw Error('BASE_URL is empty');
    }
    return { success: true, data: process.env.BASE_URL + shortenedUrl.hash };
  }
}
