import express from "express"
import {PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const app = express();
app.use(express.json());


app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;

    console.log("reaqched here");

    await client.$transaction(async tx => {
        console.log("reaqched here 2");
        const run = await tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });
        console.log("reaqched here 3");

        await tx.zapRunOutbox.create({
            data: {
                zapRunId: run.id
            }
        })
    })
    res.json({
        message: "Webhook received"
    })
})

app.listen(3000);
