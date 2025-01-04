import { Role } from "src/common/enums/role.enums";
import { CreateUserDto } from "src/users/dto";


export const DATA_SEED_USERS = 
    {
        "name":"superadmin",
        "lastname": "superadmin",
        "password": "123456",
        "confirmPassword": "123456",
        "role": Role.SUPERADMIN,
        "email":"superadmin@superadmin.com"
    }
// export const DATA_SEED_USERS: CreateUserDto[] = [
//     {
//         "name":"superadmin",
//         "lastname": "superadmin",
//         "password": "123456",
//         "confirmPassword": "123456",
//         "role": Role.SUPERADMIN,
//         "email":"superadmin@gmail.com"
//     },
//     {
//         "name":"admin",
//         "lastname": "admin",
//         "password": "123456",
//         "confirmPassword": "123456",
//         "role": Role.ADMIN,
//         "email":"admin@gmail.com"
//     },
//     {
//         "name":"user",
//         "lastname": "user",
//         "password": "123456",
//         "confirmPassword": "123456",
//         "role": Role.USER,
//         "email":"user@gmail.com"
//     }
// ] 