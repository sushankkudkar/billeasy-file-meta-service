import {
    Controller,
    Post,
    UseGuards,
    Req,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard';
import { AwsS3Service } from '~/processors/aws/aws.s3.service';

import { webStreamToNodeStream } from '~/common/utils/stream.util';

@Controller('file')
@UseGuards(JwtAuthGuard)
export class FileController {
    private readonly logger = new Logger(FileController.name);

    constructor(
        private readonly awsS3Service: AwsS3Service,
        private readonly configService: ConfigService,
    ) { }

    @Post('upload')
    async uploadToFilebase(@Req() req: any) {
        const s3BucketName = this.configService.get('app.s3Bucket');

        // req.parts() returns an async iterator over multipart parts
        const parts = req.parts();

        let fileStream: NodeJS.ReadableStream | any | null = null;
        let fileName: string | null = null;

        for await (const part of parts) {
            if (part.file) {
                fileName = `${Date.now()}-${part.filename}`;
                if ('getReader' in part.file && typeof part.file.getReader === 'function') {
                    fileStream = webStreamToNodeStream(part.file as ReadableStream);
                } else {
                    fileStream = part.file as NodeJS.ReadableStream;
                }
                break;
            }
        }

        if (!fileStream || !fileName) {
            throw new BadRequestException('No file uploaded');
        }

        try {
            const uploadResult = await this.awsS3Service.uploadFile(
                s3BucketName,
                fileName,
                fileStream,
            );
            return {
                success: true,
                code: 201,
                message: `${uploadResult.Key} File successfully uploaded to S3 and import job queued.`,
                error: null,
                data: {
                    s3Url: uploadResult.Location,
                }
            };
        } catch (error) {
            throw new BadRequestException(`Upload failed: ${error.message}`);
        }
    }
}
