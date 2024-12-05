import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import Issue  from '../interface/issue';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, callback) => callback(null, file.originalname),
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<{
    complianceScore: number;
    issues: Issue[];
}> {
    const analysis = await this.fileUploadService.analyzeFile(file.path);
    fs.unlinkSync(file.path); // Cleanup uploaded file
    return analysis;
  }
}
