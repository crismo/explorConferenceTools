import * as pg from "pg"
const { Client } = pg.default



class StorageManager {

    static #instance;
    #credentials;

    constructor(credentials) {
        if (!StorageManager.#instance) {
            console.log(Client);
            StorageManager.#instance = this;
            this.#credentials = {
                connectionString: credentials,
                ssl: {
                    rejectUnauthorized: false
                }
            };
        }

        return StorageManager.#instance;
    }

    async updateBadge(badgeId, firstName, lastName, email) {

        const client = new Client(this.#credentials);
        let query = `UPDATE "public"."badges" SET "firstName" = ${this.nullOrValue(firstName)}, "lastName" = ${this.nullOrValue(lastName)}, "email" = ${this.nullOrValue(email)} WHERE "badgeId" = '${badgeId}' RETURNING *`;
        let results = null;
        try {
            await client.connect();
            results = await client.query(query);
            results = results.rows;
        } catch (err) {
            results = err;
        } finally {
            client.end();
        }

        return results;

    }

    async updateBadgeRequests(badgeId, vendorid) {

        const client = new Client(this.#credentials);
        let query = `UPDATE "public"."badges" SET "contact" = COALESCE("contact",'') ||  ${this.nullOrValue(vendorid)} WHERE "badgeId" = '${badgeId}' RETURNING *`;
        let results = null;
        try {
            await client.connect();
            results = await client.query(query);
            results = results.rows;
        } catch (err) {
            results = err;
        } finally {
            client.end();
        }

        return results;

    }

    nullOrValue(value) {

        if (value) {
            return `'${value}'`;
        }
        return null;

    }

    async getBadge(badgeId) {

        const client = new Client(this.#credentials);
        let query = `SELECT * FROM "public"."badges" WHERE "badgeId" = '${badgeId}'`;
        let results = null;
        try {
            await client.connect();
            results = await client.query(query);
            results = results.rows;
        } catch (err) {
            results = err;
        } finally {
            client.end();
        }

        return results;
    }



    async bulkInsertBadges(badges) {

        const client = new Client(this.#credentials);
        let insert = badges.map(row => `('${row}')`).join(',');
        let query = `INSERT INTO "public"."badges"("badgeId") VALUES ${insert} RETURNING id`;

        console.log(query);

        let results = null;
        try {
            await client.connect();
            results = await client.query(query);
            results = results.rows;
            client.end();
        } catch (err) {
            results = err;
        } finally {
            client.end();
        }

        return results;

    }

}


export default StorageManager;