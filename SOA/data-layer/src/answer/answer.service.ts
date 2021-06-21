import {Injectable} from '@nestjs/common';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager, LessThan} from "typeorm";
import {CreateAnswerDto} from "./dto/create-answer.dto";
import {Answer} from "../entities/answer.entity";
import {Question} from "../entities/question.entity";

@Injectable()
export class AnswerService {
    constructor(@InjectEntityManager() private manager : EntityManager) {}

    async checkForQuestion(paramId: number) {
        return await this.manager.findOne(Question, paramId);
    }

    async insertAnswer(paramId: number, createAnswerDto: CreateAnswerDto) : Promise<Answer> {
        return this.manager.transaction( async manager => {
            const answer_to_be_created = {
                text: createAnswerDto.text,
                question : {id: paramId},
                userId : createAnswerDto.userId
            }
            const the_answer = await this.manager.create(Answer, answer_to_be_created);
            const answer_created = await this.manager.save(the_answer);

            return answer_created;
        });
    }

    async findQuestionAnswersQuery(QuestionID : number): Promise<Object[]> {
        return await this.manager.find(Answer, {where: {questionId: QuestionID}});
    }

    async findAnswersForUserQuery(UserID : number): Promise<Object[]> {
        return await this.manager.find(Answer, {where: {userId: UserID}});
    }

    async findAllDateQuery(date_from: Date, userid: number): Promise<Object[]> {
        return await this.manager.find(Answer, {
            where: {date_created: LessThan(date_from), userId: userid},
            order: {
                date_created: "DESC",
            },
            take: 10,
        });
    }
}
