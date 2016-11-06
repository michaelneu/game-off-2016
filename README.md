# GitHub Game Off 2016

## How to run

- Install Phoenix: http://www.phoenixframework.org/docs/installation
- Make sure you got a local postgres installation running (default configuration)
- Make sure your environment variables contain valid github tokens (see below)
- cd into the  project directory
- Run `npm install`
- Run `mix deps.get` to load all dependencies
- Run `mix ecto.create` to create the database
- Run `mix phoenix.server` to start the local dev server at localhost:4000

## Set GitHub oauth environment variables

- Create an github oauth app with the following settings
  - Homepage Url: http://localhost:4000
  - Callback Url: http://localhost:4000/auth/github/callback
- Set your environment variables to match the client variables
  - GITHUB_CLIENT_ID
  - GITHUB_CLIENT_SECRET
