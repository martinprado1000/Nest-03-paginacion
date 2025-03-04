import * as Joi from 'joi';
// Los valoredes default definidos aca son para el caso que no enten definidos en la variable de entorno.
// Los valores que pongo aca por default prevalecen ante el envLoader.
// para que no me de error NO lo puede dejar vacio en el .env, directamente no tiene que estar definido dicha variable.

export const envSchema = Joi.object({ 
  PORT: Joi.number().default(3000), // Asigno por default en 3000 en el caso que no lo pasen
  NODE_ENV: Joi.string().default('dev'),
  DATABASE_URI: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().allow('', null),
  DATABASE_PASSWORD: Joi.string().allow('', null),
  PAGINATIOS_DEFAULT_LIMIT: Joi.number().default(20) 
});
