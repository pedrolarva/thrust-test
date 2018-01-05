# thrust-getting-started

A simple Thrust app, which can easily be deployed to Heroku.

## Running Locally

Make sure you have Java installed.  Also, install the [Heroku Toolbelt](https://toolbelt.heroku.com/).

```sh
$ git clone https://github.com/cneryjr/thrust-heroku-web.git
$ cd thrust-heroku-web
$ heroku local web
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

If you're going to use a database, ensure you have a local `.env` file that reads something like this:

```
DATABASE_URL=postgres://localhost:5432/database_name
```

## Deploying to Heroku

```sh
$ heroku create
$ git push heroku master
$ heroku open
```

## Documentation

For more information about using Thrust see:

- [thrustjs introduction](https://thrustjs.gitbooks.io/thrustjs/)