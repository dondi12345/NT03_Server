import { MongoDBDatabase } from './Database/MongoConnect';

export = {
    InitDatabase: async function () {
      console.log("Init db")
      await new MongoDBDatabase().connectAsync();
    },
  };