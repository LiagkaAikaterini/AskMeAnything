import {
    IsDateString,
    IsInt,
    IsNotEmpty, IsNumber,
    IsObject,
    IsString,
    MaxLength
} from "class-validator";

export class MessageAnswerDto {
    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    readonly id: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(10000)
    readonly text : string;

    @IsDateString()
    @IsNotEmpty()
    readonly date_created: Date;

    @IsInt()
    @IsNumber()
    @IsNotEmpty()
    readonly Userid: number;

    @IsObject()
    @IsNotEmpty()
    readonly question: object;
}