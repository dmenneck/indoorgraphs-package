declare const saveGraph: any, exportForProductionBuild: any;
declare const getShortestPath: any;
interface NodeInterface {
    currentCoordinates: number[] | null;
    id: string;
    type: string;
    level: string;
    adjacentNodes?: object;
    attributes?: object;
}
interface DefaultRoutingOptions {
    attributes: object;
    pathOptions: object;
    preferElevator: boolean;
    [key: string]: any;
}
interface Nodes {
    [key: string]: NodeInterface;
}
declare const defaultRoutingOptions: DefaultRoutingOptions;
declare const defaultActiveFilter: {};
declare const validateNodes: (graph: any) => any;
interface SecondArgument {
    routingOptions: DefaultRoutingOptions;
    filter: any;
}
