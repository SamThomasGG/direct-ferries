import { SearchController } from '@/search/search.controller';
import { SearchService } from '@/search/search.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
