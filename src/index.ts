import bodyParser from "body-parser";
import express from "express";
import { initializeDatabase, openDatabase } from "./database";
import { confirmHandler } from "./server/confirm";
import { listHandler } from "./server/list";
import { uploadHandler } from "./server/upload";

const app = express();

// Increase the limit for JSON payloads to 50mb
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const port = 3000;
app.use(express.json());

app.post("/upload", uploadHandler);

app.patch("/confirm", confirmHandler);

app.get("/:customer_code/list", listHandler);

(async () => {
  await openDatabase();
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
