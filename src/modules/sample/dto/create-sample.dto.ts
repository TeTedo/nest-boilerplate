import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSampleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
