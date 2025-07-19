import { Point } from "typeorm";

/**
 * Make GeoJSON object from pair
 */
function makePoint(coordinates: [number, number]): Point {
    return { type: "Point", coordinates };
}

/**
 * Extract pair from GeoJSON object
 */
function getCoordinates({ coordinates }: Point): [number, number] {
    if (coordinates.length < 2) throw Error("Invalid coordinates");
    return [coordinates[0], coordinates[1]];
}

