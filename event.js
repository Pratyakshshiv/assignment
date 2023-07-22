const { MongoClient } = require("mongodb");
const fs = require("fs");

class Events {
  constructor() {
    this.eventHandlers = {};
    this.db = null;
  }

  async initializeMongoDB() {
    try {
      const mongoClient = new MongoClient(
        "mongourl",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      await mongoClient.connect();
      this.db = mongoClient.db("event_logs");
      console.log("Connected to MongoDB successfully!");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }

  on(eventName, callback) {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    this.eventHandlers[eventName].push(callback);
  }

  trigger(eventName) {
    const handlers = this.eventHandlers[eventName];
    if (handlers) {
      handlers.forEach((callback) => callback());
    }
    if (this.db) {
      this.db.collection("event_logs").insertOne({
        event: eventName,
        triggerTime: new Date(),
      });
    }
    const logMessage = `${eventName} --> ${new Date()}\n`;
    fs.appendFile("app.log", logMessage, (err) => {
      if (err) console.error("Error writing to app.log:", err);
    });
  }
  off(eventName) {
    delete this.eventHandlers[eventName];
  }
}

module.exports = Events;
