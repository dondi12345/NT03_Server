import mongoose, { ConnectOptions } from 'mongoose';
import { Mongo } from '../../other/Env';

export class MongoDBDatabase {

  async connectAsync() {
    const options: ConnectOptions = {
      dbName: Mongo.DbName,
      keepAlive: true,
    };

    mongoose.connection.on('error', (err) => {
      console.log('MongoDB error Database.ts: ' + err);
    });

    try {
      await mongoose.connect(Mongo.dbLink, options);
      console.log('MongoDb connected ');
    } catch (e) {
      console.log('MongoDb error : ' + e);
    }
  }
}
