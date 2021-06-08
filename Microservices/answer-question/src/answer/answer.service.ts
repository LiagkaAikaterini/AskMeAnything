import {HttpService, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm"
import {createQueryBuilder, EntityManager, Repository} from "typeorm"
import {RedisService} from "nestjs-redis";
import {CreateAnswerDto} from "./dto/create-answer.dto";
import {Answer} from "./entities/answer.entity";
import {Question} from "./entities/question.entity";
import {MessageDto} from "./dto/Message.dto";


@Injectable()
export class AnswerService {
  private client: any;
  constructor(@InjectEntityManager() private manager : EntityManager,
              private httpService: HttpService,
              private redisService: RedisService) {
    this.getClient();
  }
  private async getClient() {
    this.client = await this.redisService.getClient();
  }

  async create (paramId: number, createAnswerDto: CreateAnswerDto) : Promise<Answer> {
    return this.manager.transaction( async manager => {

      const myQuestion = await this.manager.findOne(Question, paramId);

      if (!myQuestion)
        throw new NotFoundException(`Question with id ${paramId} not found, so it can't be answered`);

      else {
        const answer_to_be_created = {
          text: createAnswerDto.text,
          question : {id: paramId},
          Userid : createAnswerDto.Userid
        }
        const the_answer = await this.manager.create(Answer, answer_to_be_created);
        const answer_created = await this.manager.save(the_answer);

        await this.httpService.post('http://localhost:4200/answers', answer_created).toPromise();

        return answer_created;
      }
    });
  }

  async subscribe (): Promise<string> {
    let sub = await this.client.hget('subscribers', 'questions');
    let subscribers = JSON.parse(sub);
    let myAddress = "http://localhost:8000/create_answer/message";
    let alreadySubscribed = false;

    if (subscribers == null){
      subscribers = [];
      subscribers[0] = myAddress;
      await this.client.hset('subscribers', 'questions', JSON.stringify(subscribers));
      return "Subscribed";
    }
    else {
      for (let i = 0; i < subscribers.length; i++) {
        if (subscribers[i] == myAddress)
          alreadySubscribed = true;
      }
      if (alreadySubscribed == false) {
        subscribers.push(myAddress);
        await this.client.hset('subscribers', 'questions', JSON.stringify(subscribers));
        return "Subscribed";
      }
      else
        return "Already subscribed";
    }
  }

  async updateQuestionDatabase (msgDto : MessageDto): Promise<Question> {
    return this.manager.transaction(async updateQuestionID => {
      const questionId_to_be_created = {
        id : msgDto.id
      }
      const the_questionId = await this.manager.create(Question, questionId_to_be_created);
      const questionId_created = await this.manager.save(the_questionId);

      return questionId_created;
    });
  }

  async retrieveLostMessages() : Promise<string> {
    let msg = await this.client.hget('questionMessages', 'create_answer');
    let messages = JSON.parse(msg);

    if (messages == null || messages == []) {
      await this.client.hset('questionMessages', 'create_answer', JSON.stringify(messages));
      return "No lost messages"
    }
    else {
      for (let i = 0; i < messages.length; i++) {
        let questionId_to_insert = {
          id: messages[i].id
        }
        let the_questionId = await this.manager.create(Question, questionId_to_insert);
        await this.manager.save(the_questionId);
      }
      await this.client.hset('questionMessages', 'create_answer', JSON.stringify([]));
      return "Saved data successfully";
    }
  }

}
