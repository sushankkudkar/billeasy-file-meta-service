import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import * as fs from 'fs';
import * as crypto from 'crypto';

import { FileService } from '~/processors/database/services/all.service';

@Injectable()
export class FileModuleService {
    constructor(
        private readonly fileService: FileService,
        @InjectQueue('fileQueue') private readonly fileQueue: Queue,
    ) { }

    /**
 * Process the file and return extracted data.
 * This is the pure business logic.
 * @param filePath - Path to the uploaded file
 * @returns Extracted info string (e.g. hash)
 */
    async processFile(filePath: string): Promise<string> {
        const buffer = fs.readFileSync(filePath);
        // Example: create SHA256 hash of file content
        const hash = crypto.createHash('sha256').update(buffer).digest('hex');

        // Add any other processing here, return relevant info
        return `SHA256: ${hash}`;
    }

}
