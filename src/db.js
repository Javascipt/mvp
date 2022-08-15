const _ = require("lodash");
const when = require("when");
const Pool = require("pg-pool");
const pg_escape = require("pg-escape");
const config = require("./config");

class PgClient {
    constructor() {
        this.pool = new Pool(config.db);

        this.pool.on("remove", () => { });
        this.pool.on("connect", () => { });
    }

    connect() {
        return this.pool.connect();
    }

    async _query(query, parameters) {
        let client;

        try {

            client = await this.connect();

            const result = await client.query({ text: query, values: parameters });

            return result.rows;
        } catch (error) {

            throw error;
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    query(query, parameters) {
        return when(this._query(query, parameters));
    }

    async _queryRaw(query) {
        let client;

        try {
            client = await this.connect();

            const result = await client.query(query);

            return result.rows;
        } catch (error) {
            throw error;
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    queryRaw(query) {
        return when(this._queryRaw(query));
    }

    async _insert(entity, values) {

        let client;
        const keys = [];
        const params = [];

        _.forIn(values, (value, key) => {
            keys.push(key);
            params.push(value);
        });

        const query = pg_escape("INSERT INTO %s (%s) VALUES %L", entity, keys, params);

        try {
            client = await this.connect();

            const result = await client.query(query);

            return result;
        } catch (error) {

            throw error;
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    insert(entity, values) {
        return when(this._insert(entity, values));
    }
}

module.exports = new PgClient();