const express = require('express');
const cors = require('cors')
const port = process.env.PORT || 3000;
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.wtx9jbs.mongodb.net/?retryWrites=true&w=majority`;
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('server is running..')
})

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const DBConnect = () => {
    try {
        client.connect();
        console.log('Task management Database Connected Successfully');
    }
    catch (error) {
        console.log(error.name, error.message);
    }
}
DBConnect();


const taskUsers = client.db('Task').collection('taskUsers');
const allTask = client.db('Task').collection('allTask');

app.get('/users', async (req, res) => {
    const result = await taskUsers.find().toArray();
    res.send(result);
})
app.get('/task', async (req, res) => {
    const { email } = req?.query;
    console.log(email);
    let query = {}
    if (email) {
        query.userEmail = email;
    }
    const result = await allTask.find(query).toArray();
    console.log(result);
    res.send(result);
})
// start
app.post('/users', async (req, res) => {
    const user = req.body;
    const exist = await taskUsers.findOne({ email: user.email })
    if (exist) {
        return res.send({ message: "another user has same email " });
    }
    const result = await taskUsers.insertOne(user);
    res.send(result);
})
app.post('/task', async (req, res) => {
    const task = req?.body || "not given";
    const result = await allTask.insertOne(task);
    res.send(result);

})

app.patch('/task', async (req, res) => {
    const { id } = req.query;
    const updatedData = req.body;
    const filter = { _id: new ObjectId(id) }
    const up = {
        $set: {
            TaskName: updatedData.TaskName,
            priority: updatedData.priority,
            description: updatedData.description,
            data: updatedData.date,

        }
    }
    const result = await allTask.updateOne(filter, up);
    res.send(result)
})

app.patch('/task/status', async (req, res) => {
    const { id } = req.query;
    const status = req.body;
    console.log(status, id, 'upppppppp');
    const up = {
        $set: {
            status: status.status
        }
    }
    const filter = { _id: new ObjectId(id) }
    const result = await allTask.updateOne(filter, up);
    res.send(result)

})

app.delete('/task', async (req, res) => {
    const { id } = req.query;
    console.log(id);
    const filter = { _id: new ObjectId(id) }
    const result = await allTask.deleteOne(filter);
    res.send(result)
})













app.listen(port, () => {
    console.log('server in running on ', port);
})