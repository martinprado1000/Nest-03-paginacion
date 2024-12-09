import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // SchemaFactory: crea el modelo del schema
import { Role } from 'src/common/enums/role.enums';

@Schema({
  timestamps: true,
})
export class User {

  @Prop({ // Esto le indica que es una propiedad del documento
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  lastname: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
  })
  password: string;

  @Prop({
    required: true,
    trim: true,
    default: "USER"
  })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User); // SchemaFactory.createForClass: esto es lo que crea el modelo.


// Recordar importar el schema en el modulo:
// imports: [
//   MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Le indico al modulo el nombre y el esquema que va a usar 
// ],