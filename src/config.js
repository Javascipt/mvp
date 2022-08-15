module.exports = {
    http: {
        port: process.env.PORT,
    },
    db: {
        connectionString: process.env.DB_CONNECTION_STRING,
        idleTimeoutMillis: 60000,
        max: 20,
    },
}