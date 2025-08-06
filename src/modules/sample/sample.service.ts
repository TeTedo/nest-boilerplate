import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Sample } from './entities/sample.entity';
import { CreateSampleDto } from './dto/create-sample.dto';

@Injectable()
export class SampleService {
  constructor(
    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
  ) {}

  async createSample(
    createSampleDto: CreateSampleDto,
    queryRunner: QueryRunner,
  ) {
    const sample = queryRunner.manager.create(Sample, {
      name: createSampleDto.name,
      description: createSampleDto.description,
    });
    return await queryRunner.manager.save(sample);
  }

  async getSample(): Promise<Sample[]> {
    return await this.sampleRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}
