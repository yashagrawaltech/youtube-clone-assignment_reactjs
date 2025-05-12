import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 3001, // Set the port from environment variable or default to 3001
    node_env: process.env.NODE_ENV.toString() || 'development', // Set the node environment from environment variable or default to 'development'
    mongodb_uri: process.env.MONGODB_URI.toString(), // Set the mongodb connection string from environment variable
    jwt_secret: process.env.JWT_SECRET.toString(),
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME.toString(),
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY.toString(),
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET.toString(),
};

export default config;
