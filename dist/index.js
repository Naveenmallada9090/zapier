import express from "express";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
const app = express();
app.use(express.json());
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    console.log("BODY:", body);
    console.log("CONTENT TYPE:", req.headers["content-type"]);
    console.log("reached here");
    await client.$transaction(async (tx) => {
        console.log("reached here 2");
        const run = await client.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });
        console.log("reached here 3");
        await client.zapRunOutbox.create({
            data: {
                zapRunId: run.id
            }
        });
    });
});
app.listen(3000);
//# sourceMappingURL=index.js.map