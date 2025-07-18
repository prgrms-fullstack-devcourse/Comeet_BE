import { Location } from "./location";
import { Point } from "typeorm";

export function locationToPoint({ lng, lat }: Location): Point {
    return { type: "Point", coordinates: [lng, lat], };
}

export function pointToLocation(point: Point): Location {
    const [lng, lat] = point.coordinates;
    return new Location(lng, lat);
}