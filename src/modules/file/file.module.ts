import { Module } from '@nestjs/common';

import { FileController } from './file.controller';
import { FileModuleService } from './file.service';

import { FileService } from '~/processors/database/services/all.service';
import { BullmqModule } from '~/processors/bullmq/bullmq.module';
import { AWSModule } from '~/processors/aws/aws.module';

@Module({
    imports: [BullmqModule, AWSModule],
    controllers: [FileController],
    providers: [
        FileModuleService,
        FileService
    ],
    exports: [FileModuleService],
})
export class FileModule { }
