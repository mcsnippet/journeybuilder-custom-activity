require('dotenv').config(); // JL dotenv: Loads environment variables from a .env file.
const cookieParser = require('cookie-parser'); // JL cookieParser: Middleware for parsing cookies.
const express = require('express'); // JL express: The Express.js framework for building web applications.
const helmet = require('helmet'); // JL helmet: Middleware for adding various HTTP security headers.
const httpErrors = require('http-errors'); // JL http-errors: Helps in creating HTTP error objects.
const logger = require('morgan'); // JL logger: Middleware for logging HTTP requests and responses.
const path = require('path'); // JL path: Node.js module for working with file paths.
const bodyParser = require('body-parser'); // JL body-parser: Middleware for parsing the request body.
const routes = require('./routes/index'); // JL routes: Imports a module for handling routes.
const activityRouter = require('./routes/activity'); // JL activityRouter: Imports a module specifically for custom activity routes.

const app = express(); // This line creates an instance of the Express.js application and assigns it to the app variable. 
app.use(
// app.use() is a method in Express used to mount middleware functions. 
// Middleware functions are functions that have access to the request (req) and response (res) objects and can perform various tasks,
// such as modifying the request, response, or terminating the request-response cycle.

/*
The code below configures the helmet middleware to set a Content Security Policy (CSP) for your Express.js application. 
The CSP defines rules for what types of content can be loaded and from which sources. 
In this case, it restricts content loading to the same origin by default and allows embedding in frames from specific Salesforce Marketing Cloud domains, enhancing the security of your custom activity.
*/
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'frame-ancestors': ["'self'", `https://mc.${process.env.STACK}.exacttarget.com`, `https://jbinteractions.${process.env.STACK}.marketingcloudapps.com`],
      },
    },
  }),
);

// view engine setup
/*
In summary, these two lines are configuring your Express.js application to use the "pug" template engine for rendering views, and it specifies the directory 
where these view templates can be found ('views' in the same directory as your app.js file). 
This allows you to use Pug templates to generate dynamic HTML content in your application's views.
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json()); // JL This middleware is used to parse incoming JSON data from HTTP request bodies.
app.use(express.urlencoded({ extended: false })); // JL This middleware is used to parse incoming URL-encoded data from HTTP request bodies.
app.use(cookieParser());
app.use(bodyParser.raw({
  type: 'application/jwt',
})); // This middleware is used to parse incoming request bodies with a specific content type ('application/jwt' in this case). 

app.use(express.static(path.join(__dirname, 'public')));
// This middleware serves static files, such as HTML, CSS, JavaScript, images, and other assets, from a directory named "public."

// serve config
app.use('/config.json', routes.config);

// custom activity routes
/*
This line sets up a route for the "execute" action of your custom activity in Salesforce Marketing Cloud Journey Builder. 
Requests to /journey/execute/ are handled by the activityRouter.execute middleware.
*/
app.use('/journey/execute/', activityRouter.execute); 
app.use('/journey/save/', activityRouter.save);
app.use('/journey/publish/', activityRouter.publish);
app.use('/journey/validate/', activityRouter.validate);

// serve UI
app.use('/', routes.ui);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpErrors(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
