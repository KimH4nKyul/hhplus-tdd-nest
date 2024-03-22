import { Module } from '@nestjs/common';
import { PointController } from './controller/point.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PointController],
})
export class PointModule {}
