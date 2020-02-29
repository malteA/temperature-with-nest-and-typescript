import { Module, HttpModule } from '@nestjs/common';
import { RequestsService } from './requests.service';

@Module({
    imports: [HttpModule],
    providers: [RequestsService]
})
export class RequestsModule {}
