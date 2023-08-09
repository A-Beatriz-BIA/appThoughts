const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express(); //importa o módulo express

const conn = require("./db/conn"); // pega conexão

// Models
const Thought = require("./models/Thought"); // cria o modelo de pensamentos

// routes
const authRoutes = require("./routes/authRoutes"); // rota de autenticação
const thoughtsRoute = require('./routes/thoughtsRoutes') // rota de pensamentos
const ThoughtController = require('./controllers/ThoughtController') //instancia do controlador para ele estar presente

app.engine("handlebars", exphbs()); // renderização
app.set("view engine", "handlebars");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//session middleware
app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  }),
)

// flash messages
app.use(flash());

app.use(express.static("public"));

// set session to res
app.use((req, res, next) => {
  // console.log(req.session)
  console.log(req.session.userid); // ver se a sessão do usuario tá logado

  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

app.use("/", authRoutes);
app.use("/thoughts", thoughtsRoute)
app.get("/", ThoughtController.showThougths)

conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
