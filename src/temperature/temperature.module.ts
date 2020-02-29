import { Module, HttpModule } from '@nestjs/common';
import { TemperatureController } from './temperature.controller';
import { TemperatureService } from './temperature.service';
import { RequestsService } from 'src/requests/requests.service';
import { RequestsModule } from 'src/requests/requests.module';

@Module({
  imports: [HttpModule],
  controllers: [TemperatureController],
  providers: [TemperatureService, RequestsService]
})
export class TemperatureModule {}
