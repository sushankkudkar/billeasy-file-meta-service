import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import * as stream from 'stream';

@Injectable()
export class AwsS3Service {
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: this.configService.get('app.filebase.endpoint'),
      credentials: {
        accessKeyId: this.configService.get('app.filebase.key')!,
        secretAccessKey: this.configService.get('app.filebase.secretKey')!,
      },
    });
  }

  /**
   * Upload a CSV file to S3
   * @param bucketName - The S3 bucket name
   * @param fileName - The file name to save as in S3
   * @param fileStream - The file stream (can be a readable stream)
   */
  async uploadFile(bucketName: string, fileName: string, fileStream: stream.Readable): Promise<any> {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileStream,
      ContentType: 'text/csv',
    };

    const upload = new Upload({
      client: this.s3,
      params: params,
      leavePartsOnError: false,
    });

    try {
      const result = await upload.done();
      console.log('result--->', result)
      return result;
    } catch (error) {
      console.error('Error during file upload:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  /**
   * Read the content of a CSV file from S3 as a stream
   * @param bucketName - The S3 bucket name
   * @param fileName - The file name in S3
   */
  async getFileStream(bucketName: string, fileName: string): Promise<stream.Readable> {
    const getObjectParams = {
      Bucket: bucketName,
      Key: fileName,
    };

    const command = new GetObjectCommand(getObjectParams);

    try {
      const { Body } = await this.s3.send(command);

      if (Body instanceof stream.Readable) {
        return Body;
      } else if (Body instanceof Buffer) {
        const passThroughStream = new stream.PassThrough();
        passThroughStream.end(Body);
        return passThroughStream;
      } else {
        throw new Error('The file is not a readable stream or buffer.');
      }
    } catch (err) {
      console.error('Error fetching file from S3:', err);
      throw err;
    }
  }
}
