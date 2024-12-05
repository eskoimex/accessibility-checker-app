import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { HeadingAnalysisService } from '../helpers/heading-analysis.helpers';
import { ImageAnalysisService } from '../helpers/image-analysis.helpers';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService, HeadingAnalysisService, ImageAnalysisService],

})
export class FileUploadModule {}
