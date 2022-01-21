/*
save times that users log on.
Display times in a list.
*/

import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

//express init
const app = express();
const port = process.env.PORT || 4200;

//pug init
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public"))); //for images

//visit logger
var file = __dirname + "/public/visits";
var numVisits: number = 0;
const myLogger = (req: Request, res: Response, next: NextFunction): void => {
    var data: string = "0";
    try {
        data = fs.readFileSync(file, "utf8");
    } catch (err) {
        console.error(err);
    }

    numVisits = parseInt(data) + 1;

    try {
        fs.writeFileSync(file, numVisits.toString());
        //file written successfully
    } catch (err) {
        console.error(err);
    }
    next();
};
app.use(myLogger);

//funny number check
const funnyNumberChecker = (req: Request, res: Response, next: NextFunction) => {
    if (numVisits % 69 == 0) {
        console.log("nice");
        fs.writeFileSync(file, "0");
    }
    next();
};
app.use(funnyNumberChecker);

//home page
app.get("/", (req: Request, res: Response, next: NextFunction): void => {
    res.render("index.pug", {
        pageVisits: numVisits,
    });
    next();
});

//404 page
app.get("/404", (req: Request, res: Response, next: NextFunction): void => {
    res.render("404");
    next();
});

//start app
app.listen(port, (): void => {
    console.log("live at http://localhost:" + port);
});
