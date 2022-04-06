var createError = require("http-errors");
var express = require("express");
var session = require("express-session");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//We are including mongoose in the program using require
/* const mongoose = require("mongoose"); */

var usersRouter = require("./routes/users");
/* var sqproductsRouter = require("./routes/sqproducts"); */
/* var squsersRouter = require("./routes/squsers"); */
/* var productsRouter = require("./routes/products"); */
/* var indexcompanyRouter = require("./routes/index"); */
/* var companyRouter = require("./routes/company");
var employeeRouter = require("./routes/employee"); */

var app = express();
app.use(
  session({
    secret: "session_secret_key",
    resave: true,
    saveUnintialized: true,
    cookie: {
      secure: false,
    },
  })
);
/* //This line will make all variables written in .env file into our application through process variable
require("dotenv").config();
//We are defining a connection string to connect to the mongodb
console.log(`The application name is ${process.env.appName}`);
//We are defining a connection string to connect to the mongodb
/* let mongoConnUrl = "mongodb://localhost/westsidenode"; 
//We are connecting the mongodb
mongoose.connect(process.env.mongoConnUrl, { useNewUrlParser: true });
//We are getting the connection pointer
let db = mongoose.connection;
//We are now adding error event and it will run if there is any error in connecting to mongodb
db.on("error", function (error) {
  console.log("unable to connect");
  console.log(error);
});
//We are adding open event and responding in the call back function if connection is successful
db.on("open", function () {
  console.log("we are connected to the mongodb server via mongoose");
}); */

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Models
var models = require("./models");
//Sync Database
models.sequelize
  .sync()
  .then(() => {
    console.log("Nice! Database looks fine");
  })
  .catch((err) => {
    console.log(err, "Something went wrong with the Database update!");
  });

//Require our roots into the application
/* require("./routes")(app);
app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to the beginning of nothingness",
  })
); */
app.use("/users", usersRouter);
/* app.use("/sqproducts", sqproductsRouter); */
/* app.use("/squsers", squsersRouter); */
/* app.use("/products", productsRouter); */
/* app.use("/index", indexcompanyRouter); */
/* app.use("/company", companyRouter);
app.use("/employee", employeeRouter); */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
