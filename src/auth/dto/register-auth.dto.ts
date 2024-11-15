import { IsNotEmpty, MinLength, IsEmail, Matches, IsString, IsOptional, IsEnum } from "class-validator";
import { Role } from "src/users/enums/role.enums";

export class RegisterAuthDto {

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

    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^[^\s]+$/, { message: 'The confirm password must not contain spaces' })
    confirmPassword: string;
    
    @IsOptional()
    @IsEnum(Role)
    @Matches(/^[^\s]+$/, { message: 'The role must not contain spaces' })
    role?: Role;

}