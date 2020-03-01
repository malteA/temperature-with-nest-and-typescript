import { ICurrentTemperature } from "../interfaces/ICurrentTemperature";

export class CurrentTemperature implements ICurrentTemperature {
    City: string;
    CountryCode: string;
    CurrentTemperature: number;
    MinTemperature: number;
    MaxTemperature: number;
    FeelsLikeTemperature: number;
    Unit: string;
}