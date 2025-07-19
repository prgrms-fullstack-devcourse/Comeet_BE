import { Point } from "typeorm";

function makePoint(coordinates: [number, number]): Point {
    return { type: "Point", coordinates };
}

function getCoordinates({ coordinates }: Point): [number, number] {
    if (coordinates.length < 2) throw Error("Invalid coordinates");
    return [coordinates[0], coordinates[1]];
}

