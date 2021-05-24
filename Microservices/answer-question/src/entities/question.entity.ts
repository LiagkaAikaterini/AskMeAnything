import {Entity, Column, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Answer} from "./answer.entity";

@Entity({ schema: "answer_question" })
export class Question{
    @PrimaryGeneratedColumn({type: "integer"})
    id: number;

    @OneToMany(() => Answer, answer => answer.question)
    answers: Answer[];
};