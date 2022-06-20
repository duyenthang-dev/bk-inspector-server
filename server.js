const dotenv = require('dotenv');
const mongoose = require('mongoose');
const PORT = 5000;
dotenv.config({ path: './config.env' });
const db = process.env.DATABASE_LOCAL;
mongoose
    .connect(db)
    .then(() => console.log('DB connected'))
    .catch((err) => console.log(err));
const app = require('./app');

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});
