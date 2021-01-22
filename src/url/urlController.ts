import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Route,
    Response,
    SuccessResponse,
} from "tsoa";
import { UrlService } from "./urlService";
import {JsonResponse} from "../types/JsonResponse";

@Route("")
export class UrlController extends Controller {

    /**
     * route to convert shortened url hash to original url
     *
     * @param hash
     */
    @Response("404", "test")
    @Get("{hash}")
    public async getOriginalUrl(@Path() hash: string): Promise<JsonResponse> {

        const url = await new UrlService().getOriginalUrl(hash);
        if (!url) {
            this.setStatus(404);
            return {success: false, error: "No url with this hash found"};
        }
        return {success: true, data: url};
    }

    @SuccessResponse("201", "Created")
    @Post()
    public async createShortUrl(@Body() body: { url: string }): Promise<JsonResponse> {

        const { url } = body;
        const shortenedUrl = await new UrlService().createShortUrl(url)
        if (!shortenedUrl) {
           this.setStatus(500)
            return {success: false, error: "Error while creating short url, please try again"}
        }
        return {success:true, data: process.env.BASE_URL! + shortenedUrl.hash};
    }
}
