import { ConfigService } from 'nestjs-config';
import { IUrlOption } from './interfaces/IUrlOption';
import Constants from "./const/request.const";
import { Injectable, HttpService, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class RequestsService {
    private _apiUrl: string;
    private _apiKey: string;
    private _httpService: HttpService;

    /**
     * Creates an instance of request.service and loads api key and url by NestJS config service
     * @param config NestJS config service
     * @param httpService NestJS Axios wrapper/HTTP service
     */
    constructor(private readonly config: ConfigService, private readonly httpService: HttpService) {
        this._getApiUrl();
        this._getApiKey();
        this._httpService = httpService;

    }

    getHttpRequestPromiseObject(urlOptions: IUrlOption[]): Promise<AxiosResponse<any>> {
        return this._httpService.get(this._buildUrl(Constants.SCOPE.Weather, urlOptions)).toPromise();
    }

    private _buildUrl(scope: string, urlOptions: IUrlOption[]): string {
        let url = `${this._apiUrl}/`;
        url = this._addScope(url, scope);
        url = this._addUrlOptions(url, urlOptions);
        url = this._addApiKey(url);
        return url;
    }

    private _addScope(url: string, scope: string): string {
        return url += `${scope}`;
    }

    private _addUrlOptions(url: string, urlOptions: IUrlOption[]): string {
        urlOptions.forEach((option, index) => {
            let urlEncodedOption: string;
            if (option.Option === null) {
                urlEncodedOption = `,${option.Value}`;
            } else {
                urlEncodedOption = `${option.Option}=${option.Value}`;
            }

            if (index === 0) {
                url += `?${urlEncodedOption}`;
            } else if (urlEncodedOption.startsWith(',')) {
                url += urlEncodedOption;
            } else {
                url += `&${urlEncodedOption}`;
            }
        });
        return url;
    }

    private _addApiKey(url: string): string {
        return url += `&${Constants.OPTIONS.ApiKey}=${this._apiKey}`;
    }

    private _getApiUrl() {
        const baseUrl = this.config.get('api-config').baseUrl;
        if (!baseUrl) {
            throw new HttpException(`baseUrl in api-config.ts couldn't be found!`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const apiVersion = this.config.get('api-config').apiVersion;
        if (!apiVersion) {
            throw new HttpException(`apiVersion in api-config.ts couldn't be found!`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        this._apiUrl = `${baseUrl}/${apiVersion}`;
    }

    private _getApiKey() {
        const apiKey = this.config.get('api-key').key;

        if (!apiKey) {
            throw new HttpException(`key in api-key.ts couldn't be found!`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        this._apiKey = apiKey;
    }
}
