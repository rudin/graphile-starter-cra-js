import express, { Express } from "express";

if (!process.env.NODE_ENV) {
  throw new Error("No NODE_ENV envvar! Try `export NODE_ENV=development`");
}

// const isDev = process.env.NODE_ENV !== "production";

export default async function installClient(app: Express) {

  app.use(express.static(`${__dirname}/../../../client/build`))

  app.get("*", function(_req, res) {
    res.sendFile(`${__dirname}/../../../client/build`, "index.html");
  });

}
