import mongoose, { ConnectOptions } from 'mongoose';
import { Mongo } from '../../Enviroment/Env';

export class MongoDBDatabase {

  async connectAsync() {
    console.log("Dev 1684475659 DB connecting")
    const options: ConnectOptions = {
      dbName: Mongo.DbName,
      keepAlive: true,
    };

    mongoose.connection.on('error', (err) => {
      console.log('1684475666 MongoDB error Database.ts: ' + err);
    });

    try {
      await mongoose.connect(Mongo.dbLink, options);
      console.log('Dev 1684475677 MongoDb connected');
    } catch (e) {
      console.log('Dev 1684475682 MongoDb error : ' + e);
    }
  }
}
