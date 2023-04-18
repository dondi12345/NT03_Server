import { MongoDBDatabase } from './Database/MongoConnect';

export = {
    Init: async function () {
      await new MongoDBDatabase().connectAsync();
    },
  };