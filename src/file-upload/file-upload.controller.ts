import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { diskStorage } from 'multer';

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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const analysis = await this.fileUploadService.analyzeFile(file.path);
    return analysis;
  }
}
