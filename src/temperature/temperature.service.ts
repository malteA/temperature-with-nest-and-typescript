import { Injectable, HttpService, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ICurrentTemperature } from './interfaces/ICurrentTemperature';
import { CurrentTemperature } from './models/CurrentTemperature';
import { ConfigService } from 'nestjs-config';
import { RequestsService } from 'src/requests/requests.service';
import { IUrlOption } from 'src/requests/interfaces/IUrlOption';
import RequestConstants from 'src/requests/const/request.const';

@Injectable()
export class TemperatureService {
    
    private _unit : string;
    private _temperatureUnit : string;
    private _request: RequestsService;
    
    /**
     * Creates an instance of temperature.service and loads api key and configuration for the temperature service by NestJS config service
     * @param config NestJS config service
     * @param request Central requests service
     */
    constructor(private readonly config: ConfigService, private readonly request: RequestsService) {
        this._getTemperatureUnit();
        this._request = request;
    }

    /**
     * Returns the current temperature from a location located by zip code and country code
     * @param countryCode Two digits ISO 3166 country code (e. g. de)
     * @param zipCode Zip code (e. g. 10243 for Berlin)
     */
    async getTemperatureByZipCode(countryCode: string, zipCode: string): Promise<ICurrentTemperature> {
        if (!countryCode) {
            throw new HttpException(`Required param "countryCode" wasn't given!`, HttpStatus.BAD_REQUEST);
        }
        if (!zipCode) {
            throw new HttpException(`Required param "zipCode" wasn't given!`, HttpStatus.BAD_REQUEST);
        }
        if (countryCode.length !== 2) {
            throw new HttpException(`ISO 3166 country code only has two characters. Given code ${countryCode}`, HttpStatus.BAD_REQUEST);
        }

        try {            
            const urlOptions: IUrlOption[] = [
                { Option: RequestConstants.OPTIONS.Zip, Value: zipCode },
                { Option: RequestConstants.OPTIONS.CountryCode, Value: countryCode }
            ];

            if(this._unit) {
                urlOptions.push({ Option: RequestConstants.OPTIONS.Unit, Value: this._unit });
            }
            const response = await this._request.getHttpRequestPromiseObject(urlOptions);
            let currentTemperature: ICurrentTemperature = new CurrentTemperature();
            currentTemperature.Unit = this._temperatureUnit;
            currentTemperature.CurrentTemperature = response.data.main.temp;
            currentTemperature.MaxTemperature = response.data.main.temp_max;
            currentTemperature.MinTemperature = response.data.main.temp_min;
            currentTemperature.FeelsLikeTemperature = response.data.main.feels_like;
            currentTemperature.City = response.data.name;
            currentTemperature.CountryCode = response.data.sys.country;

            return currentTemperature;
        } catch (err) {
            throw new InternalServerErrorException(err, "An error occured while calling th api");
        }
    }

    /**
     * Returns temperature by geographic coordinates
     * @param lat Latitude
     * @param lon Longitude
     */
    async getTemperatureByGeographicCoordinates(lat: string, lon: string): Promise<ICurrentTemperature> {
        if(!lat) {
            throw new HttpException(`Required param "lat" wasn't given!`, HttpStatus.BAD_REQUEST);
        }
        if(!lon) {
            throw new HttpException(`Required param "lon" wasn't given!`, HttpStatus.BAD_REQUEST);
        }

        try {
            const urlOptions: IUrlOption[] = [
                { Option: RequestConstants.OPTIONS.Lat, Value: lat },
                { Option: RequestConstants.OPTIONS.Lon, Value: lon }
            ];
            if(this._unit) {
                urlOptions.push({ Option: RequestConstants.OPTIONS.Unit, Value: this._unit });
            }
            
            const response = await this._request.getHttpRequestPromiseObject(urlOptions);

            let currentTemperature: ICurrentTemperature = new CurrentTemperature();
            currentTemperature.Unit = this._temperatureUnit;
            currentTemperature.CurrentTemperature = response.data.main.temp;
            currentTemperature.MaxTemperature = response.data.main.temp_max;
            currentTemperature.MinTemperature = response.data.main.temp_min;
            currentTemperature.FeelsLikeTemperature = response.data.main.feels_like;
            currentTemperature.City = response.data.name;
            currentTemperature.CountryCode = response.data.sys.country;

            return currentTemperature;
        } catch (err) {
            throw new InternalServerErrorException(err, "An error occured while calling th api");
        }
    }
    
    private _getTemperatureUnit() {
        const unit = this.config.get('api-config').unit;
        if (!unit) {
            throw new HttpException(`unit in api-config.ts couldn't be found!`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (unit === "metric") {
            this._temperatureUnit = "C";
            this._unit = unit;
        } else {
            this._temperatureUnit = "F";
        }
    }
}
