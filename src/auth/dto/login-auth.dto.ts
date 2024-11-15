import { IsNotEmpty, MinLength, IsEmail, Matches } from "class-validator";

export class LoginAuthDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^[^\s]+$/, { message: 'The password must not contain spaces' })
    password: string;

}
