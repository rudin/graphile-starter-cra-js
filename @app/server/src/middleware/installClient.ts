import express, { Express } from "express";

if (!process.env.NODE_ENV) {
  throw new Error("No NODE_ENV envvar! Try `export NODE_ENV=development`");
}

const isDev = process.env.NODE_ENV !== "production";

export default async function installClient(app: Express) {
  if (isDev) {
    app.get("*", (_req, res) => {
      res.redirect("http://localhost:3007");
    });
  } else {
    app.use(express.static(`${__dirname}/../../../cra-js-client/build`));
    app.get("*", (_req, res) => {
      res.sendFile(`${__dirname}/../../../cra-js-client/build`, "index.html");
    });
  }
}
