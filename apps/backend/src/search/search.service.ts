import { PrismaService } from '@/prisma/prisma.service';
import type { SearchQueryDTO } from '@/search/search.dto';
import { buildPagination } from '@/search/utils/build-pagination';
import { buildQuery } from '@/search/utils/build-query';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: SearchQueryDTO) {
    try {
      const data = await this.prisma.sailing.findMany({
        where: buildQuery(query),
        ...buildPagination(query),
      });

      const total = await this.prisma.sailing.count({
        where: buildQuery(query),
      });

      return {
        data,
        total,
        page: query.page,
        pageSize: query.pageSize,
      };
    } catch (errors) {
      console.error(errors);
      throw new InternalServerErrorException({
        message: 'Server error',
        errors,
      });
    }
  }

  async ports() {
    try {
      const [fromPorts, toPorts] = await Promise.all([
        this.prisma.sailing.findMany({
          select: { from: true },
          distinct: ['from'],
        }),
        this.prisma.sailing.findMany({
          select: { to: true },
          distinct: ['to'],
        }),
      ]);

      const portCodes = new Set([
        ...fromPorts.map((f) => f.from),
        ...toPorts.map((t) => t.to),
      ]);

      return { data: Array.from(portCodes).sort() };
    } catch (errors) {
      console.error(errors);
      throw new InternalServerErrorException({
        message: 'Server error',
        errors,
      });
    }
  }
}
