import { MongoDBDatabase } from './Database/MongoConnect';

export = {
    Init: async function () {
      console.log("Init db")
      await new MongoDBDatabase().connectAsync();
    },
  };