import express from 'express'
import StorageManager from '../tools/db.mjs';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const task = express.Router();

const tasks = {
    "template": { "name": "", "answer": ["", ""], "continue": "", "description": "", "hints": ["", ""] },
    "angram": {
        "name": "Skjult tekst", "answer": ["nøkkel", "key"], "continue": "", "description": "Finn kunsten som skjuler tekst.", "hints": ["Kunsten har mange farver", "Kunsten er i nærheten av en av inngangene"],
    },
    "1980": { "name": "Utsikt fra innsiden", "answer": ["A3023", "A3 023"], "continue": "", "description": "Ting er ikke som de ser ut til", "hints": ["Hva er ikke der som skulle vært der", "Noen rom ser ut til å være borte"] },
    "1990": { "name": "Utsikt mot UiA", "answer": ["uia"], "continue": "", "description": "Ting er ikke som de ser ut til", "hints": ["Hva er ikke der som skulle vært der", "Dekkorasjoner er ufullstendig"] },
    "1985": { "name": "En kryptisk kasse", "answer": ["box"], "continue": "", "description": "Kodet i veggene finnes et svar", "hints": ["Alfabetet ligger på veggen", "Dere har en nøkkel"] },
    "1995": { "name": "Tårnet", "answer": ["stair", "staircases", "trapp", "trapper"], "continue": "", "description": "I høyden finnes svar", "hints": ["Fra topp til bunn finnes en bit av pusslespillet", "Noe som snurrer har ting til felles med etasjer"] },
}


const templateTask = fs.readFileSync(path.join(__dirname, "../public", "task.html"), 'utf8');
const templateMain = fs.readFileSync(path.join(__dirname, "../public", "escape.html"), 'utf8');


task.get('/', async (req, res, next) => {



    res.status(200).send(templateMain);
    res.end();



});

task.get('/:id', async (req, res, next) => {

    let task = tasks[req.params.id].replace(":", "").trim();
    // remove first name, last name and email from badge
    try {
        const output = fillTemplate(templateTask, task);
        res.status(200).send(output);

    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    } finally {
        res.end();
    }

});



function fillTemplate(template, keyValues) {
    let file = (' ' + template).slice(1);

    Object.keys(keyValues).forEach(key => {
        if (key && keyValues[key]) {
            file = file.replace("{{" + key + "}}", keyValues[key]);
        }
    });

    return file;
}



export default task;