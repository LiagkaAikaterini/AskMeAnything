import {Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import { QuestionService } from './question.service';
import {JwtAuthGuard} from "./jwt-auth.guard";
import {JwtService} from "@nestjs/jwt";
import {Response, Request} from "express";
import {MessageQuestionDto} from "./dto/Message-question.dto";
import {MessageAnswerDto} from "./dto/Message-answer.dto";


@Controller('view_question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService)
              //, private readonly jwtService: JwtService)
  {}

  async onModuleInit() {
    await this.questionService.subscribeAnswers();
    await this.questionService.subscribeQuestions();
    await this.questionService.retrieveLostAnswerMessages();
    await this.questionService.retrieveLostQuestionMessages();
    return "Subscribed and retrieved messages successfully";
  }

  @Post('question_message')
  updateDatabase(@Body() msgDto : MessageQuestionDto) {
    return this.questionService.updateQuestionDatabases(msgDto)
  }

  @Post('answer_message')
  updateSumAnswers(@Body() msgDto : MessageAnswerDto) {
    return this.questionService.updateSumAnswers(msgDto)
  }

  // @UseGuards(JwtAuthGuard)
  @Get('all/:date_from')
  findAll(@Param('date_from',) date_from: Date) {
    return this.questionService.findAll(date_from)
  }

  @Get('all/:date_from/:Userid')
  findAllUser(@Param('date_from') date_from: Date, @Param('Userid') Userid : number) {
  return this.questionService.findAllUser(date_from, Userid)
}

  @Get('id/:id')
  findOne(@Param('id') id: number) {
    return this.questionService.findOne(+id)
  }

  @Get('keywords')
  findByKeywords() {
    return this.questionService.findByKeywords()
  }


  @Get('keywords_user/:Userid')
  findByKeywordsUser(@Param('Userid') Userid : number)  {
    return this.questionService.findByKeywordsUser(Userid)
  }

  @Get('per_day')
    showPerDay(){
      return this.questionService.showPerDay()
  }

  @Get('per_day_user/:Userid')
  showPerDayUser(@Param('Userid') Userid : number){
      return this.questionService.showPerDayUser(Userid)
  }

  @Get('most_popular')
  getMostPopular(){
      return this.questionService.getMostPopular()
  }

}
