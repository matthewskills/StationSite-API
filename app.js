
const fs = require('fs')
//    , https = require('https')
    , http = require('http')
    , hostname = process.env.HOSTNAME
    , port = process.env.PORT
    , express = require('express')
    , mongoose = require('mongoose')
    , userRouter = require("./routes/user")
    , stationRouter = require("./routes/station")
    , programmeRouter = require("./routes/programme")
    , errorhandler = require('errorhandler')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , dotenv = require('dotenv')
    , app = express()
    , httpServer = http.createServer(app)
    ;

dotenv.config();

//const ssl_privateKey = fs.readFileSync(process.env.SSL_PRIVATEKEY_PATH, 'utf8')
//    , ssl_certificate = fs.readFileSync(process.env.SSL_CERTIFICATE_PATH, 'utf8')
//    , ssl_chain = fs.readFileSync(process.env.SSL_CHAIN_PATH, 'utf8')
//    , ssl_credentials = { key: ssl_privateKey, cert: ssl_certificate, ca: ssl_chain}
//    , httpsServer = https.createServer(ssl_credentials, app)
//    ;

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(errorhandler());
app.use(express.urlencoded({ extended: true, limit: '50mb'}));
app.use('/user', userRouter);
app.use('/station', stationRouter);
app.use('/programme', programmeRouter);

try {
  mongoose.connect(process.env.MONGOOSE_SERVER, {useUnifiedTopology: true,useNewUrlParser: true});
} catch(err) {
  handleError(err);
}

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});


//httpsServer.listen(443, () => {
//	console.log('HTTPS Server running on port 443');
//});


httpServer.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
