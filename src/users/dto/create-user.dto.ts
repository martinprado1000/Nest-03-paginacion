import { IsString, IsNotEmpty, MinLength, IsEmail, IsOptional, IsEnum, Matches } from "class-validator";
import { Role } from "../enums/role.enums";

export class CreateUserDto {
    
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @Matches(/^[^\s]+$/, { message: 'The name must not contain spaces' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @Matches(/^[^\s]+$/, { message: 'The lastname must not contain spaces' })
    lastname: string;

    @IsEmail()
    @IsNotEmpty()
    @MinLength(5)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^[^\s]+$/, { message: 'The password must not contain spaces' })
    password: string;

    @IsOptional()
    @IsEnum(Role)     // Esto me retorna la error:  "message": ["role must be one of the following values: SUPERADMIN, ADMIN, OPERATOR, USER"],
    @Matches(/^[^\s]+$/, { message: 'The role must not contain spaces' })
    role?: Role;
}
