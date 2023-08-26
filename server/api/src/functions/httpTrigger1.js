const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");
require("dotenv").config();

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

app.http("httpTrigger1", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const client = new CosmosClient({ endpoint, key });
    const { database } = await client.databases.createIfNotExists({
      id: "AzureResume",
    });
    const { container } = await database.containers.createIfNotExists({
      id: "Counter",
    });

    const data = await container.items.query("SELECT * from c").fetchAll();
    const updatedCount = data.resources[0].count + 1;
    await container.items.upsert({
        id: data.resources[0].id,
        count: updatedCount,
      });

    context.log(`Http function processed request for url "${request.url}"`);

    return {
      body: JSON.stringify({count: updatedCount}),
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    };
  },
});
