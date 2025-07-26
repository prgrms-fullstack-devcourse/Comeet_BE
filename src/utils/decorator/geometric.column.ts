import { Column, ColumnOptions, Point, ValueTransformer } from "typeorm";
import { Coordinates } from "../coordinates";

const __transformer: ValueTransformer = {
    from(point: Point): Coordinates {
        const [lng, lat] = point.coordinates;
        return new Coordinates({ lng, lat });
    },
    to(coordinates: Coordinates): Point {
        const { lng, lat } = coordinates;
        return { type: "Point", coordinates: [lng, lat] };
    }
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