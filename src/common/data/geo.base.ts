import { ModelBase } from "./model.base";
import { Column, Point } from "typeorm";

const __transformer = {
    from: ({ coordinates }: Point): [number, number] =>
        [coordinates[0], coordinates[1]],

    to: (coordinates: [number, number]): Point =>
        ({ type: "Point", coordinates })
};

export class GeoBase extends ModelBase {
    @Column({
        type: "geometry",
        spatialFeatureType: "Point",
        srid: 4326,
        transformer: __transformer
    })
    location: [number, number];
}