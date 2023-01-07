> **WARNING**:
> This project is currently still in beta phase. If you encounter bugs, don't be afraid to open a ticket.

## What is indoorgraphs?

indoorgraphs is a node package that enables client-side routing in your mapping application. Create indoor graphs with the 
[indoorgraphs](https://indoorgraphs.de/) web application and perform attribute-based queries to calculate (accessible) shortest paths directly on the users device. 


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

## Class methods

`graph.getNodes()` return all nodes

`graph.setNodes(data)` set new nodes

`graph.getOptions()` return routing options

`graph.setOptions(options)` set new routing options

`graph.getFilter()` return routing filter

`graph.setFilter(filter)` set new filter

`graph.getRoutableOptions()` get all the attributes that can be used to query paths

`graph.getRoute(start, dest)` calculate shortest path from start to dest

## Routing options

indoorgraphs enables attribute-based routing queries. All attributes included in the graph can be queried using `graph.getRoutableOptions()`.
The following query ignores all paths where the path width is greater than 5 meters. 

```js
// setup filter and routing options
const routingOptions = {
    pathOptions: { pathWidth: ["5", "max"]},
    doorOptions: {},
    preferElevator: false
}

const filter = {
    pathWidth: true
} 

// create a new indoor graph
const graph = new IndoorGraphs(data, { routingOptions, filter });
```

## Routing filter

The task of the routing filter is to enable or disable the query of certain attributes. Per default, all attributes are enabled. 
That's why the following declarations are the same:

```js
const filter = {
    pathWidth: true
} 

// SAME AS

const filter = {}
```

...however, if you want to disable an attribute, you have to specify it: 

```js
const filter = {
    pathWidth: false
} 
```

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am 'Add some feature'`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request :sunglasses:

## Authors

* **Dirk Mennecke**  - [dmenneck](https://github.com/dmenneck)

