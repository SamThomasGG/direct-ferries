import { HealthResponseDto } from '@/app.dto';
import { ApiEndpoint } from '@/common/decorators/api-endpoint.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get('health')
  @ApiEndpoint({
    summary: 'Health check',
    description: 'Check if the API is running',
    responseType: HealthResponseDto,
  })
  health() {
    return {
      status: 'ok',
    };
  }
}
