const { PineconeClient } = require('@pinecone-database/pinecone');
const pinecone = new PineconeClient();

pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENV,
});

module.exports = pinecone;
