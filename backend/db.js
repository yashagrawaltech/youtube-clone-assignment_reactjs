import mongoose from 'mongoose';
import config from './config.js';

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000;

class DBConnection {
    constructor(URI) {
        this.uri = URI;
        this.retryCount = 0;
        this.isConnected = false;

        mongoose.set('strictQuery', true);

        mongoose.connection.on('connected', () => {
            console.log(
                `MongoDB connected successfully at host ${mongoose.connection.host}`
            );
            this.isConnected = true;
        });

        mongoose.connection.on('error', (error) => {
            console.log(`MongoDB connection error occurred: ${error.message}`);
            this.isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log(
                `MongoDB disconnected successfully at host ${mongoose.connection.host}`
            );
            this.handleDisconnection();
        });

        process.on('SIGTERM', this.handleTermination.bind(this));
    }

    // Methods for DBConnections

    // Connect To DB
    async connect() {
        if (!this.uri) {
            throw new Error(`MongoDB connection string is missing`);
        }
        try {
            const connectionOptions = {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 5000,
                family: 4, // IPv4
            };

            if (config.node_env === 'development') {
                mongoose.set('debug', true);
            }

            if (!this.isConnected) {
                await mongoose.connect(this.uri, connectionOptions);
                this.retryCount = 0;
            }
        } catch (error) {
            console.log(`MongoDB Connection Error: ${error.message}`);
            await this.handleError(error);
        }
    }

    // Handle DB Reconnection
    async handleDisconnection() {
        if (this.isConnected) {
            console.log(`Attempting to reconnect to MongoDB`);
            return this.connect();
        }
    }

    // Handle If gets Terminate
    async handleTermination() {
        try {
            await mongoose.connection.close();
            console.log(`MongoDB connection closed`);
            process.exit(0);
        } catch (error) {
            console.log(`Error closing MongoDB connection: ${error.message}`);
            process.exit(1); // Exit with error code
        }
    }

    // Handle error
    async handleError(lastError) {
        if (this.retryCount < MAX_RETRIES) {
            this.retryCount += 1;
            console.log(
                `Retrying MongoDB connection attempt ${this.retryCount} of ${MAX_RETRIES} due to error: ${lastError.message}`
            );
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, RETRY_INTERVAL);
            });
            return this.connect();
        } else {
            throw new Error(
                `Failed to connect to MongoDB after ${MAX_RETRIES} attempts: ${lastError.message}`
            );
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name,
        };
    }
}

const connection = new DBConnection(config.mongodb_uri);

const connectToMongoDB = connection.connect.bind(connection);
export const getDbStatus = connection.getConnectionStatus.bind(connection);

export default connectToMongoDB;
