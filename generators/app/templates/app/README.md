# Introductions
This is an example to show for to get started with a single page website, this boilerplate consists of React for the View, Redux to manage the state of the store and Webpack to '*bundle them all!!*'

This Generator kit goes on the assumption that you have Nodejs & npm pre-installed on your system. If not check out the below links

* Nodejs & npm
 * https://nodejs.org/en/download/
 * Pick Up an LTE version of the node. This should include NPM (node package manager), so OS distribution have there own repo for the node. In which case 'Google them out!'

## Installation
* Run `npm install`, if not already.
 * This will load all the package dependencies which are required for the stack to function.
* Run this example that uses the StackExchange API to get StackOverflow questions by using the same commands as given in the development environment usage.
* Change the namespace, schema and other details on the `package.json` file.

## Usage
* For development environment, run the commands `npm run start-dev` and `npm run watch-client` each on two different terminals.
* For production environment, run the command `npm run start-prod`.

## What Happening under-the-hood
One word description is 'Magic'. So when you start the server with eiher `npm run start-dev && npm run watch-client` or `npm run start-prod` then in basically sets the environment variables and then start off the server.js (/bin/server.js) in development 'or' production mod respectively.

**NOTE:**
 * The development is a bit different from production server. The development run the basic http server on port 3000. The second server which start off is a webpack development server running on 3001. The dev server only job is to monitor the file-system for changes and then re-compile the webpack bundle.
 * In production the server basically pre-compiles the files and bundles them (Production server should be fast right). And the primary server running at 8080 serves the pages and content.

## Watch the tutorial below
* [Redux-Explained](https://egghead.io/courses/getting-started-with-redux)
* [React-Redux-Webpage-tutorials](https://www.youtube.com/watch?v=MhkGQAoc7bc&list=PLoYCgNOIyGABj2GQSlDRjgvXtqfDxKm5b)

## Things you need to know to work on the Stack
* **React:** this our view layer of the stack and it a pretty interesting because one of the slowest element of web-rendering of the page is the actual rendering of the HTML DOM element. React takes a different approach to solve this, it basically makes a virtual DOM and then computes the entire Virtual DOM based on the state of the application (Virtual DOM computation is much faster than the actual render) and it compare the Virtual DOM with the actual DOM and then only render the changes on the page.
[React-docs](https://facebook.github.io/react/docs/hello-world.html)

* **Redux:** so redux is the a library based of the flux-architecture with a bit of a learn-curve because is fundamental different from conventional front-end development, but the benefit is that it does scale for big application. You need to use the redux to define the common reducer (/src/reducer.js).
 * Important rule in redux development is the idea of immutable object, what this means is that every state object you change should be a new version of the object and not a mutated version of the original object.
   * Example of mutation: a = {}; a['key'] = 'something';
   * What redux expect: a = {} a = { ...a, key: 'something'};
 * You can check the redux documentation [Redux-Docs](http://redux.js.org/)

* **React-route:** which is used to direct the url to the respective pages 'or' react-components. You can find the routes.js file in the src directory (/src/routes.js). For more info on react-router check out [React-router-APIs-docs](https://github.com/ReactTraining/react-router/tree/master/docs)

## Other important stuff
* **reducer.js:** File consists of the all the reducer combined. A reducer takes an 'action' and based on the action returns a new state 'or' return the old state. Remember a reducer needs to return a state no matter what!
* **Html.js:** The base HTML which will be rendered to the browser all react component are render to this file. The changes to this file is shared to all pages of the site.
* **Components:** The folder with the react components.
*Note* we need to add index.js with the mapping to the file for the given react component. Refer to the ReactJS documentation to understand how to define a component, this include binding the component with the eventHandler, state management, injection of the state, JSX syntactic way of defining a component and importing and exporting them etc.
* **fetch.js:** fetch is a generic function to fetch data using AJAX calls.
   * An Async calls or AJAX calls are important in Single Page Applications, since it gives the application a way to update parts of the page without re-rendering the entire HTML. You can check the code at /src/component/SOHot/Actions.js (load method), the method make a requestObject using **makeRequest** and **createDefaultFetchOption** functions which can be found at /src/utils/fetch.js
* **SSR** Server-side-rendering is an important aspect of a page which requires search-engine to crawl and gather content. To enable SSR for a given component you can find in the routes.js (/src/routes.js) file serverDispatch which takes an array of functions (functions returned by makeRequest).
These states are loaded on the server before the page is rendered to the user.

Dig through the code-base a bit more and play with the various component. Figure out what works and why it does the browser's 'inspect-element' and 'console' are your friends. They will help you understand various bug and will help with the debugging and development process.

If you have an doubt or thoughts on the document you can email me at koshy@hasura.io
