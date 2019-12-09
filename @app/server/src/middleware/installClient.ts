import express, { Express } from "express";
import cors from "cors"
// import proxy from "http-proxy-middleware"

if (!process.env.NODE_ENV) {
  throw new Error("No NODE_ENV envvar! Try `export NODE_ENV=development`");
}

const isDev = process.env.NODE_ENV !== "production";

export default async function installClient(app: Express) {

  if (isDev) {
    const whitelist = ["http://localhost:3007"]
    const corsOptions = {
    origin: function(origin:any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  }
}

app.use(cors(corsOptions))
    // const apiProxy = proxy('http://localhost:3007', {ws: true, changeOrigin: true});
    // app.use('/', apiProxy);
    app.get("*", function(_req, res) {
      res.redirect('http://localhost:3007');
    });

  } else {
    app.use(express.static(`${__dirname}/../../../client/build`))

    app.get("*", function(_req, res) {
      res.sendFile(`${__dirname}/../../../client/build`, "index.html");
    });
  }

}
