import { MongoDBDatabase } from './Database/MongoConnect';

export = {
    InitDatabase: async function () {
      console.log("1684475639 Init db")
      await new MongoDBDatabase().connectAsync();
    },
  };