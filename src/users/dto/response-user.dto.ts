import { Exclude, Expose, Transform } from 'class-transformer';
import { Role } from 'src/common/enums/role.enums';

export class ResponseUserDto {
  @Expose()
  name: string;

  @Expose()
  lastname: string;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  @Expose()
  @Transform(({ obj }) => obj._id.toString()) // Transforma `_id` a `id` como string
  id: string;
}
