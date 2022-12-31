# indoorgraphs

Use indoor graphs built with [indoorgraphs](https://indoorgraphs.de/) to implement client-side routing in your mapping application.


## Installation


To install the library, run:

```sh
$ npm install indoorgraphs
```

## How to use indoorgraphs?

```js
const { IndoorGraphs } = require("indoorgraphs");

// load a graph built with indoorgraphs.de
const data = require("./graphs/test.json");

// setup filter and routing options
const routingOptions = {
    pathOptions: {},
    doorOptions: {},
    preferElevator: false
}

const filter = {} 

// create a new indoor graph
const graph = new IndoorGraphs(data, { routingOptions, filter });

const [coordinates, visitedNodes, instructions, error] = graph.getRoute("UG_t1", "EG_t4");

if (!error) {
    console.log(instructions)
}

// do something with coordinates, visitedNodes and instructions
```

## class methods

`graph.getNodes()` return all nodes

`graph.setNodes(data)` set new nodes

`graph.getOptions()` return routing options

`graph.setOptions(options)` set new routing options

`graph.getFilter()` return routing filter

`graph.setFilter(filter)` set new filter

`graph.getRoute(start, dest)` calculate shortest path from start to dest

## Contributing


1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am 'Add some feature'`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request :sunglasses:


## Authors

* **Dirk Mennecke**  - [dmenneck](https://github.com/dmenneck)

