import {Body, Controller, Post} from '@nestjs/common';
import { ChoreographerService } from './app.service';
import {SendAnswerDto} from "./dto/send-answer.dto";
import {SendQuestionDto} from "./dto/send-question.dto";

@Controller()
export class ChoreographerController {
  constructor(private readonly choreographerService: ChoreographerService) {}

  async onModuleInit() {
    await this.choreographerService.checkForLostAnswers();
    await this.choreographerService.checkForLostQuestions();
    return "Retrieved lost messages successfully";
  }

  @Post('answers')
  sendAnswer(@Body() sendAnswerDto: SendAnswerDto) {
    return this.choreographerService.sendAnswers(sendAnswerDto)
  }

  @Post('questions')
  sendQuestion(@Body() sendQuestionDto: SendQuestionDto) {
    return this.choreographerService.sendQuestions(sendQuestionDto)
  }

}
