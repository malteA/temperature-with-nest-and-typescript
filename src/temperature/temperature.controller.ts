import { Controller, Get, Param, Request, Query } from '@nestjs/common';
import { ICurrentTemperature } from './interfaces/ICurrentTemperature';
import { TemperatureService } from './temperature.service';
import { ApiQuery, ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('weather')
@Controller('temperature')
export class TemperatureController {

    constructor(private temperatureService: TemperatureService) {}

    @Get(":countryCode/:zipCode")
    @ApiResponse({ description: "Returns a temperature object containing all informations", status: 200 })
    @ApiParam({ name: 'countryCode', description: 'Two digits ISO 3166 country code (e. g. de)', example: 'de' })
    @ApiParam({ name: 'zipCode', description: 'Zip code (e. g. 10243 for Berlin)', example: '10243' })
    async getCurrentTemperatureByZipCode(@Param('countryCode') countryCode: string, @Param('zipCode') zipCode: string) {
        const currentTemperature : ICurrentTemperature = await this.temperatureService.getTemperatureByZipCode(countryCode, zipCode);
        return currentTemperature;
    }

    @Get("coordinates")
    @ApiQuery({ name: 'lat', description: 'Contains lat for geocoordinates', example: '52.515538' })
    @ApiQuery({ name: 'lon', description: 'Contains lon for geocoordinates', example: '13.440308' })
    async getCurrentTemperatureByGeographicCoordinates(@Query() query) {
        const currentTemperature : ICurrentTemperature = await this.temperatureService.getTemperatureByGeographicCoordinates(query.lat, query.lon);
        return currentTemperature;
    }
}
