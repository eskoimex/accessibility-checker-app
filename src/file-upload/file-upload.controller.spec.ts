import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { mock } from 'jest-mock-extended';
import { HttpException } from '@nestjs/common';

describe('FileUploadController', () => {
  let fileUploadController: FileUploadController;
  let fileUploadService: FileUploadService;

  // Mock fs.unlinkSync and FileUploadService
  const fsUnlinkSyncMock = jest.fn();
  const fileUploadServiceMock = mock<FileUploadService>();

  beforeEach(async () => {
    // Create a TestingModule with mocks
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [
        {
          provide: FileUploadService,
          useValue: fileUploadServiceMock,
        },
      ],
    })
      .overrideProvider('fs')
      .useValue({ unlinkSync: fsUnlinkSyncMock }) // Mock fs.unlinkSync
      .compile();

    fileUploadController = module.get<FileUploadController>(FileUploadController);
    fileUploadService = module.get<FileUploadService>(FileUploadService);
  });

  it('should be defined', () => {
    expect(fileUploadController).toBeDefined();
  });


  it('should handle errors if analyzeFile throws an exception', async () => {
    // Mock the file upload service to throw an error
    const error = new Error('Analysis failed');
    fileUploadServiceMock.analyzeFile.mockRejectedValue(error);

    const mockFile = {
      path: './uploads/test-file.html',
      originalname: 'test-file.html',
      mimetype: 'text/html',
    } as Express.Multer.File;

    // Call the uploadFile method and expect it to throw an exception
    await expect(fileUploadController.uploadFile(mockFile)).rejects.toThrowError(error);
    expect(fileUploadServiceMock.analyzeFile).toHaveBeenCalledWith(mockFile.path);
  });
});
