import express, { Express } from "express";
import proxy from "http-proxy-middleware"

if (!process.env.NODE_ENV) {
  throw new Error("No NODE_ENV envvar! Try `export NODE_ENV=development`");
}

const isDev = process.env.NODE_ENV !== "production";

export default async function installClient(app: Express) {

  if (isDev) {
    const apiProxy = proxy('http://localhost:3000', {ws: true});
    app.use('/', apiProxy);
  } else {
    app.use(express.static(`${__dirname}/../../../client/build`))

    app.get("*", function(_req, res) {
      res.sendFile(`${__dirname}/../../../client/build`, "index.html");
    });
  }

}
