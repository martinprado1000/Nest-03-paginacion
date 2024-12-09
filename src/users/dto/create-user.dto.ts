import { IsString, IsNotEmpty, MinLength, IsEmail, IsOptional, IsEnum, Matches } from "class-validator";
import { Transform } from 'class-transformer';
import { Role } from 'src/common/enums/role.enums';

export class CreateUserDto {
    
    @IsString()
    @Transform(({ value }) => value?.toUpperCase()) // Convierte el valor a mayúsculas
    @IsNotEmpty()
    @MinLength(2)
    @Matches(/^[^\s]+$/, { message: 'The name must not contain spaces' })
    @Transform(({ value }) => capitalize(value))
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @Matches(/^[^\s]+$/, { message: 'The lastname must not contain spaces' })
    @Transform(({ value }) => capitalize(value))
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

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^[^\s]+$/, { message: 'The confirm password must not contain spaces' })
    confirmPassword: string;

    @IsOptional()
    @IsEnum(Role)     // Esto me retorna la error:  "message": ["role must be one of the following values: SUPERADMIN, ADMIN, OPERATOR, USER"],
    @Matches(/^[^\s]+$/, { message: 'The role must not contain spaces' })
    @Transform(({ value }) => value?.toUpperCase()) // Convierte el valor a mayúsculas
    role?: Role;
}

function capitalize(value: string): string {
    console.log('Transforming value:', value);
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}