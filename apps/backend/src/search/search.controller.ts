import { ApiEndpoint } from '@/common/decorators/api-endpoint.decorator';
import { Cached } from '@/common/decorators/cache.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import {
  PortsResponseDto,
  type SearchQueryDTO,
  SearchQueryDto,
  SearchQuerySchema,
  SearchResponseDto,
} from '@/search/search.dto';
import { SearchService } from '@/search/search.service';
import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Search')
@ApiSecurity('x-api-key')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('')
  @ApiEndpoint({
    summary: 'Search ferries',
    description:
      'Search for ferry crossings with optional filters and pagination',
    responseType: SearchResponseDto,
    queryType: SearchQueryDto,
  })
  @UsePipes(new ZodValidationPipe(SearchQuerySchema))
  @Cached((query: SearchQueryDTO) => `search:${JSON.stringify(query)}`, 600_000)
  async search(@Query() query: SearchQueryDTO) {
    return await this.searchService.search(query);
  }

  @Get('ports')
  @ApiEndpoint({
    summary: 'Get port codes',
    description: 'Get list of all available port codes',
    responseType: PortsResponseDto,
  })
  @Cached('ports', 600_000)
  async ports() {
    return await this.searchService.ports();
  }
}
