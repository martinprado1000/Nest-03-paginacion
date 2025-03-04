import { IsNotEmpty, IsEmail, IsEnum } from "class-validator";
import { Role } from 'src/common/enums/role.enums';

export class RequestAuthDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEnum(Role)
    role: Role;

}
