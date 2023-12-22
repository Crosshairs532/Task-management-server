const express = require('express');
const cors = require('cors')
const port = process.env.PORT || 3000;
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
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


app.get('/users', async (req, res) => {
    const result = await taskUsers.find().toArray();

})
app.post('/users', async (req, res) => {
    const user = req.body;
    const exist = await taskUsers.findOne({ email: user.email })
    if (exist) {
        return res.send({ message: "another user has same email " });
    }
    const result = await taskUsers.insertOne(user);
    res.send(result);
})












app.listen(port, () => {
    console.log('server in running on ', port);
})