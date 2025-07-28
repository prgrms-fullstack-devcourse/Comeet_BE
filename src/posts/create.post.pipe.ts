import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class CreatePostPipe implements PipeTransform {

    transform(value: any, metadata: ArgumentMetadata): any {
    }
}