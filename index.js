const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i9w8jvi.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const postCollection = client.db('SocioPlus').collection('posts');
        app.get('/posts', async (req, res) => {
            const query = {};
            const cursor = postCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
    }
    finally {

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Socio Plus Server Running');
});

app.listen(port, () => {
    console.log(`Socio Plus server running on ${port}`);
});