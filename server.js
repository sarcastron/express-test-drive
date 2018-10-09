const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
const app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(`${__dirname}/views/partials`);

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use((req, res, next) => {
  const now = new Date().toString();
  const logEntry = `${now}: ${req.method} ${req.url}`;
  fs.appendFile('./server.log', logEntry+'\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log!', err);
    }
  });
  console.log(logEntry);
  next();
});

app.use(express.static(`${__dirname}/public`));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Hiya buddy!'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: "D'oh!",
  });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
