import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class MongoConnectionService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    try {
      await this.waitForConnection();
      console.log('Connection to MongoDB established.');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      process.exit(1); // Opcional: Salir si no hay conexión
    }
  }

  private waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connection.readyState === 1) {
        return resolve();
      }
      this.connection.on('connected', () => resolve());
      this.connection.on('error', (err) => reject(err));
    });
  }
}
