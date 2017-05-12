# Gantt Planner

An advanced planning tool using gantt charts implemented with the help of the [DHTMLX Gantt Chart Library](https://docs.dhtmlx.com/gantt/), [Ember.js](https://www.emberjs.com/) and [Ruby on Rails](http://rubyonrails.org/).

![Screenshot of the homepage](images/screenshot-homepage.png)

## Heroku

In order for the following to work properly, ensure that you've added the following lines (see above) to your `Gemfile`:

```
gem 'ember-cli-rails'
```

To configure your EmberCLI-Rails applications for Heroku:

```
$ bundle exec rails generate ember:heroku
$ git add .
$ git commit -m"Ran rails generate ember:heroku"
```

Add the NodeJS buildpack and configure NPM to include the bower dependency's executable file.

```
$ heroku buildpacks:clear
$ heroku buildpacks:add --index 1 heroku/nodejs
$ heroku buildpacks:add --index 2 heroku/ruby
$ heroku config:unset SKIP_EMBER
```

You are ready to deploy:

```
$ git push heroku master
```

and fire it up:

```
$ heroku open
```


## References

* [Ember.js](http://emberjs.com/)
* [Ember-cli](https://ember-cli.com/)
* [Github ember-cli-rails](https://github.com/thoughtbot/ember-cli-rails)
* [Using Rails for API-only Applications](http://edgeguides.rubyonrails.org/api_app.html)
* [Sass](http://sass-lang.com/)
* [Bootstrap v4 alpha](https://v4-alpha.getbootstrap.com/)
* [Font awesome](http://fontawesome.io/icons/)
* [Ember-cli-rails](https://github.com/thoughtbot/ember-cli-rails)
* [Rack::Attack](https://github.com/kickstarter/rack-attack)


## Author

Kiffin Gish \< kiffin.gish@planet.nl \>

[Gishtech](http://gishtech.com)  
Advanced Software Development for the Web

"You're never too old to learn new stuff..."
