import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { HeadingAnalysisService } from '../helpers/heading-analysis.helpers';
import { ImageAnalysisService } from '../helpers/image-analysis.helpers';
import { UniqueIdAnalysisService } from '../helpers/unique-id-analysis';
import { FormLabelAnalysisService } from '../helpers/form-label-analysis';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService, HeadingAnalysisService, ImageAnalysisService, UniqueIdAnalysisService, FormLabelAnalysisService],

})
export class FileUploadModule {}
