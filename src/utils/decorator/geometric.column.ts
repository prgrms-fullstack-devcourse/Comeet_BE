import { Column, ColumnOptions, Point } from "typeorm";

const __transformer = {
    from: ({ coordinates }: Point): [number, number] =>
        [coordinates[0], coordinates[1]],

    to: (coordinates: [number, number]): Point =>
        ({ type: "Point", coordinates })
};

export function GeometricColumn(options?: ColumnOptions): PropertyDecorator {

    const opts: ColumnOptions = {
        type: "geometry",
        spatialFeatureType: "Point",
        srid: 4326,
        transformer: __transformer
    };

    options && Object.assign(opts, options);

    return Column(opts);
}