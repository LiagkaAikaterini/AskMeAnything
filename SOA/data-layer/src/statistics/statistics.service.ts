import { Injectable } from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {Keyword} from "../entities/keyword.entity";
import {createQueryBuilder, EntityManager, Repository} from "typeorm";
import {addMonths} from "date-fns"
@Injectable()
export class StatisticsService {
    constructor(@InjectEntityManager() private manager : EntityManager,
                @InjectRepository(Keyword) private readonly keywordRepository : Repository<Keyword>,
    ) {}

    async findByKeywordsQuery () : Promise<Object[]> {
        return await createQueryBuilder().select('COUNT(*) as questionCount, keyword_questions_question.keywordKeyword as keyword').from('keyword_questions_question', 'keyword_questions_question').groupBy('keyword_questions_question.keywordKeyword').orderBy('questionCount', 'DESC').take(10).getRawMany()
    }

    async findByKeywordsUserQuery (Userid: number) : Promise<Object[]> {
        return await this.manager.query(`SELECT COUNT(*) as "questionCount", "C"."keywordKeyword" as "keyword" FROM (SELECT * from  "statistics"."keyword_questions_question" as "A"  INNER JOIN "statistics"."question" as "B" ON "A"."questionId"="B"."id" WHERE "B"."Userid"=${Userid}) as "C"  GROUP BY "C"."keywordKeyword"`)
    }

    async showQuestionsPerDayQuery () : Promise<Object[]> {
        const d_to = new Date();
        d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
        const date = d_to.toISOString();

        return await createQueryBuilder().select(`SUBSTRING(cast(date_created as varchar),0,11)  as date_part,COUNT(*)`).from('question', 'Question').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).groupBy(`SUBSTRING(cast(date_created as varchar),0,11)`).orderBy('count', 'DESC').take(10).getRawMany()
    }

    async showQuestionsPerDayUserQuery (Userid:number) : Promise<Object[]> {
        const d_to = new Date();
        d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
        const date = d_to.toISOString();

        return await createQueryBuilder().select(`SUBSTRING(cast(date_created as varchar),0,11)  as date_part,COUNT(*)`).from('question', 'Question').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).andWhere(`Question.Userid=${Userid}`).groupBy(`SUBSTRING(cast(date_created as varchar),0,11)`).orderBy('count', 'DESC').take(10).getRawMany()
    }

    async showAnswersPerDayQuery () : Promise<Object[]> {
        const d_to = new Date();
        d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
        const date = d_to.toISOString();
        return await createQueryBuilder().select(`EXTRACT(DAY FROM date_created),COUNT(*)` ).from('answer', 'Answer').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).groupBy(  `EXTRACT(DAY FROM date_created)`).orderBy('count', 'DESC').take(10).getRawMany()
    }

    async showAnswersPerDayUserQuery (Userid: number) : Promise<Object[]> {
        const d_to = new Date();
        d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
        const date = d_to.toISOString();
        return await createQueryBuilder().select(`SUBSTRING(cast(date_created as varchar),0,11)  as date_part,COUNT(*)`).from('Answer', 'Answer').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).andWhere(`"Answer"."Userid"=${Userid}`).groupBy(`SUBSTRING(cast(date_created as varchar),0,11)`).orderBy('count', 'DESC').take(10).getRawMany()
    }

    async countAnswersUserQuery (Userid: number) : Promise<Object[]> {
        return await this.manager.query(`SELECT COUNT(*) FROM "statistics"."answer" as A WHERE A."Userid"=${Userid}`)
    }

    async countQuestionsUserQuery (Userid: number) : Promise<Object[]> {
        return await this.manager.query(`SELECT COUNT(*) FROM "statistics"."question" as A WHERE A."Userid"=${Userid}`)
    }


}
