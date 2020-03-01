import { Module } from '@nestjs/common';
import { TemperatureModule } from './temperature/temperature.module';
import { ConfigModule } from 'nestjs-config';
import path = require('path');
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    TemperatureModule,
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}'))
  ]
})
export class AppModule {}
