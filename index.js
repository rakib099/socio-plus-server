const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());


// connected to MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i9w8jvi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const postCollection = client.db('SocioPlus').collection('posts');
        const commentCollection = client.db('SocioPlus').collection('comments');
        const infoCollection = client.db('SocioPlus').collection('infos');

        // posts api
        app.get('/posts', async (req, res) => {
            let query = {};
            const page = req.query?.page;
            let options = {
                sort: {
                    time: -1
                }
            }
            let cursor = postCollection.find(query, options);
            let result = await cursor.toArray();

            if (page === 'home') {
                options = {
                    sort: {
                        likes: -1
                    }
                }
                cursor = postCollection.find(query, options);
                result = await cursor.limit(3).toArray();
            }
            
            res.send(result);
        });

        app.get('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const post = await postCollection.findOne(query);
            res.send(post);
        });

        app.post('/posts', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        });

        // comments api
        app.get('/comments', async (req, res) => {
            const id = req.query.id;
            const query = {
                postId: id
            }
            const cursor = commentCollection.find(query);
            const comments = await cursor.toArray();
            res.send(comments);
        });

        app.post('/comments', async (req, res) => {
            const comment = req.body;
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        });

        // infos api
        app.get('/infos/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }
            const aboutInfo = await infoCollection.findOne(query);
            res.send(aboutInfo);
        });

        app.patch('/infos/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = {
                _id: new ObjectId(id)
            }
            const updateDoc = {
                $set: updateInfo
            }
            const result = await infoCollection.updateOne(filter, updateDoc);
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