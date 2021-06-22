import {HttpModule, Module} from '@nestjs/common';
import {QuestionController} from "./question.controller";
import {QuestionService} from "./question.service";

@Module({
    imports: [HttpModule],
    controllers: [QuestionController],
    providers: [QuestionService]
})
export class QuestionModule {}
