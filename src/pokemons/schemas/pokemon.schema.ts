import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // SchemaFactory: crea el modelo del schema
import { Document } from 'mongoose';

@Schema({
  timestamps: true, 
})
export class Pokemon extends Document {

  @Prop({ // Esto le indica que es una propiedad del documento
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  number: number;

}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon); // SchemaFactory.createForClass: esto es lo que crea el modelo con el nombre user.


// Recordar importar el schema en el modulo:
// imports: [
//   MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Le indico al modulo el nombre y el esquema que va a usar 
// ],