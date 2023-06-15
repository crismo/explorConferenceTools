import express from 'express'
import StorageManager from '../tools/db.mjs';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const badges = express.Router();

const template = fs.readFileSync(path.join(__dirname, "../public", "badge.html"), 'utf8');


badges.get('/:id/consent', async (req, res, next) => {

    // remove first name, last name and email from badge
    try {
        const db = new StorageManager(process.env.DB_CONNECTION);
        const results = await db.updateBadge(req.params.id, null, null, null);
        if (results instanceof Error) {
            throw new Error(results);
        }
        res.redirect(`/badges/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    } finally {
        res.end();
    }

});

badges.get('/:id', async (req, res, next) => {

    try {
        const db = new StorageManager(process.env.DB_CONNECTION);
        const results = await db.getBadge(req.params.id)
        if (results instanceof Error) {
            throw new Error(results);
        }

        let file = buildBadgeForm(req.params.id, results[0].firstName, results[0].lastName, results[0].email);
        res.set("badgeid", req.params.id);
        res.status(200).send(file);

    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    } finally {
        res.end();
    }

});

function buildBadgeForm(badgeId, firstName, lastName, email) {
    let file = (' ' + template).slice(1);
    file = file.replace("{{badgeid}}", badgeId);
    file = file.replace("{{firstName}}", firstName || "");
    file = file.replace("{{lastName}}", lastName || "");
    file = file.replace("{{email}}", email || "");

    if (firstName) {
        file = file.replace("{{consent}}", `<input type="checkbox" id="consent" name="consent" checked disabled> Jeg sammtykker <br> Trekk ditt samtykke <a href="/badges/${badgeId}/consent">her</a></br>`);
    } else {
        file = file.replace("{{consent}}", '<input type="checkbox" id="consent" name="consent" > Jeg sammtykker<br/>');
    }
    return file;
}


badges.use(express.json());

badges.get('/', (req, res, next) => { });

badges.post('/', (req, res, next) => { });


// Bulk insert new empty badges 
badges.post('/bulk', async (req, res, next) => {

    try {
        const db = new StorageManager(process.env.DB_CONNECTION);
        const results = await db.bulkInsertBadges(req.body)
        if (results instanceof Error) {
            throw new Error(results);
        }
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    } finally {
        res.end();
    }
});




badges.put('/:id', async (req, res, next) => {

    try {
        const db = new StorageManager(process.env.DB_CONNECTION);
        const results = await db.updateBadge(req.params.id, req.body.firstName, req.body.lastName, req.body.email);
        if (results instanceof Error) {
            throw new Error(results);
        }
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    } finally {
        res.end();
    }

});

badges.get('/:id/:vendorid', async (req, res, next) => {

    console.log(req.params.id, req.params.vendorid);
    try {
        const db = new StorageManager(process.env.DB_CONNECTION);


        let badge = await db.getBadge(req.params.id);
        if (badge instanceof Error) {
            throw new Error(badge);
        }
        badge = badge[0];

        /*
        if (badge.email === null || badge.email === "") {
            res.status(400).json({ error: "Email is required" });
            return;
        }*/

        const results = await db.updateBadgeRequests(req.params.id, req.params.vendorid);
        if (results instanceof Error) {
            throw new Error(results);
        }

        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    } finally {
        res.end();
    }

});

badges.delete('/:id', (req, res, next) => { });

export default badges;