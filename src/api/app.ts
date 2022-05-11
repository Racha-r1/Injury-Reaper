import express,{Application} from 'express';
import injuries from './routers/injuries';
import stats from './routers/stats';
import standings from './routers/standings';
const app: Application = express();

const port: number | string = process.env.PORT || 5000;

// use routers
app.use("/", injuries);
app.use("/stats", stats);
app.use("/standings", standings);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
