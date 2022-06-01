import { Expose } from 'class-transformer';

export class DefaultUserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
