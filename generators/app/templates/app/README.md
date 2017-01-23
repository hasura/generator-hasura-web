# Introductions
This is an example to show for to get started with a React app that does:
1) Basic Single Page App stuff
2) Page routing
3) Async request/response processing with an API

The developer tools packaged in this bundle provide:
1) Automatic bundling as you write code using webpack
2) Good Javascripting linting using ESLint
3) Clear separation of production (including minification) & development running environments
4) Ready to package and deploy as a Docker image

##Pre-requisites:
 * https://nodejs.org/en/download/
 * Node >= 4.0. Preferably ensure an LTE version of the node .

##Running this example locally
* Run `npm install` inside the app/ folder
* Run `npm run start-dev` in one terminal session. After processing, a server should start at `localhost:3000`.
* Run `npm run watch-client` in another terminal session. After processing, a webpack server should start at `localhost:3001`.
* Access your app at ``http://localhost:3000`

##Deploying this example
* To build, bundle your app files by running `npm run build`.
* In a production environment, the command `npm run start-prod` will run a server at `localhost:8080`.
* To build this as a docker image, after running `npm run build` head to the TLD (outside the `app/` folder) and run `docker build -t myapp:1.0.`.
* To run your docker image: `docker run -p 8080:8080 myapp:1.0`
* Navigate to http://localhost:8080 or http://<docker-machine-ip>:8080 .

##Learning react/redux and the tools in this stack:
* Extermely [basic react](https://facebook.github.io/react/docs/hello-world.html)
* [Redux-Explained](https://egghead.io/courses/getting-started-with-redux)
* [React-Redux-Webpage-tutorials](https://www.youtube.com/watch?v=MhkGQAoc7bc&list=PLoYCgNOIyGABj2GQSlDRjgvXtqfDxKm5b)

##How this app works
* A nodejs server listens on a port (8080 in production, 3000 during develoment)
* The nodejs app runs the same function for any route requested
* The function basically serves a simple HTML file (based off app/src/utils/Html.js)
* The HTML file contains NOTHING except the following:
  - A <link> reference to a bundled CSS file
  - A <script> reference to a bundled JS file
  - A <script> reference that contains some JS variables
* The location of the CSS, JS files and the JS variables are all templated by the nodejs server and then the final HTML is sent to the client.
* React is used for templating data into this `Html.js` file.
* The HTML is loaded by the browser, and the single JS file is loaded
* This JS file initialises React/Redux and the JS execution begins.
* This client side JS executes and creates HTML which is inserted into the DOM inside the <body> tag.

##What happens when a URL changes?
* Let's say the current URL is: `http://localhost:3000/`
* An element on the page is clicked which navigates to page: `http://localhost:300/next-page`
* This new page is loaded without hitting the server. `react-router` is used to manage which components are loaded on which `routes` (URLs).

##Server-side rendering?
* Let's say that the very first URL requested by the browser is: `http://localhost:3000/some-page`
* The nodejs server runs the react-router for the URL that is requested on the server-side itself.
* It renders all the react components that react-router maps to.
* Now instead of sending just an empty Html.js derived HTML string, the nodejs server also templates a fourth thing viz. the rendered react components into the HTML.
* On the browser, the very first HTML received now contains all the content and is hence shown to the user
* Meanwhile, the bundled JS file is also loaded and subsequent page navigations will not hit the server

##Help & support
Reach out to us at: koshy [at] hasura [dot] io in case you need any help with setting this up urgently.
Otherwise, use the [issues](https://github.com/hasura/generator-hasura-web/issues) section for fun and profit!
