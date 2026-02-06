import mongoose from 'mongoose';

let mongod;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // treat obvious placeholder URIs as not set (contain '<')
    if (!uri || uri.includes('<')) {
      console.warn('MONGO_URI not set — starting in-memory MongoDB for development/testing');
      // dynamic import so this only runs when needed
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
  } catch (error) {
    console.error('Error closing DB:', error.message);
  }
};

export default connectDB;
export { closeDB };
