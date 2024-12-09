import {IsString, IsOptional, IsNotEmpty, MinLength, IsEnum, registerDecorator, ValidationOptions, ValidationArguments, Matches} from "class-validator";
import { Transform } from 'class-transformer';
import { Role } from 'src/common/enums/role.enums';
import { ConflictException } from "@nestjs/common";

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty() // Si me mandan este dato no puedo estar vacio
    @MinLength(2) // Si me mandan este dato no puedo tener menos de 2 caracteres
    @Matches(/^[^\s]+$/, { message: 'The name must not contain spaces' })
    @Transform(({ value }) => capitalize(value))
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @Matches(/^[^\s]+$/, { message: 'The lastname must not contain spaces' })
    @Transform(({ value }) => capitalize(value))
    lastname?: string;

    // El dato email lo ignoro ya que no es editable.
    //@IsNotEditable()  // ({ message: "Email is not editable" })  Si quisiera le puedo pasar un valor de message a la funcion
    //@IsOptional()
    //email?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^[^\s]+$/, { message: 'The password must not contain spaces' })
    password?: string;

    @IsOptional()
    @IsEnum(Role)  
    @Matches(/^[^\s]+$/, { message: 'The role must not contain spaces' })
    @Transform(({ value }) => value?.toUpperCase()) // Convierte el valor a mayúsculas
    role?: Role;
} 

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function IsNotEditable(validationOptions?: ValidationOptions) { // Asi podriamos crear un decorador personalizado para validar
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotEditable',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log(value)
          // Si el campo tiene valor, entonces es editable (y no debería)
          return value === undefined || value === null;
        },
        defaultMessage(args: ValidationArguments) {
          throw new ConflictException(`The user already exists`);
        }
      },
    });
  };
}