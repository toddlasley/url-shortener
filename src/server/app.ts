import *  as express from 'express';
import * as bodyParser from 'body-parser';
import { UrlService } from './services/url-service';
import { UrlController } from './controllers/url-controller';
import { AppError } from './common/app-error';

const APP_PORT = 8080;
const app = express();
const router = express.Router();


const urlService = new UrlService();

const urlController = new UrlController(urlService);

const handleError = (error: AppError, res: express.Response) => {
    res.status(error.status || 500);
    res.send(error.message || 'An error occurred.');
    res.end();
};

router.get('/', (req: express.Request, res: express.Response) => {
    res.status(301);
    res.redirect('./index.html')
    res.end();
});

router.post('/shortened-url', (req: express.Request, res: express.Response) => {
    try {
        urlController.createShortenedUrl(req, res);
    } catch(error) {
        handleError(error, res);
    }
});

router.get('/:slug', (req: express.Request, res: express.Response) => {
    try {
        urlController.getUrl(req, res);
    } catch(error) {
        handleError(error, res);
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/client`));
app.use(router);

const server = app.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}`);
});