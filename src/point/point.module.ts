import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PointController } from './controller/point.controller';
import { PointService } from './service/point.service';
import { PointHandler } from './service/point.handler';
import { PointReader } from './service/point.reader';
import { PointMemoryRepository } from './repository/point.memory.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [PointController],
  providers: [
    PointService,
    PointReader,
    PointHandler,
    { provide: 'IPointRepository', useClass: PointMemoryRepository },
  ],
})
export class PointModule {}
