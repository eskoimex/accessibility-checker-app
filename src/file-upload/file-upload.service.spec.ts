import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadService } from './file-upload.service';
import { HeadingAnalysisService } from '../helpers/heading-analysis.helpers';
import { ImageAnalysisService } from '../helpers/image-analysis.helpers';
import * as fs from 'fs';
import * as cheerio from 'cheerio';

// Mock the fs.readFileSync function
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

// Mock the HeadingAnalysisService and ImageAnalysisService
jest.mock('../helpers/heading-analysis.helpers');
jest.mock('../helpers/image-analysis.helpers');

describe('FileUploadService', () => {
  let fileUploadService: FileUploadService;
  let headingAnalysisService: HeadingAnalysisService;
  let imageAnalysisService: ImageAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        HeadingAnalysisService,
        ImageAnalysisService,
      ],
    }).compile();

    fileUploadService = module.get<FileUploadService>(FileUploadService);
    headingAnalysisService = module.get<HeadingAnalysisService>(HeadingAnalysisService);
    imageAnalysisService = module.get<ImageAnalysisService>(ImageAnalysisService);
  });

  it('should be defined', () => {
    expect(fileUploadService).toBeDefined();
  });

  it('should analyze file and return compliance score and issues', async () => {
    const mockFilePath = './test-file.html';
    const mockFileContent = '<html><head></head><body><h1>Test Heading</h1></body></html>';

    // Mock fs.readFileSync to return the mock content
    (fs.readFileSync as jest.Mock).mockReturnValue(mockFileContent);

    // Mock heading analysis and image analysis services
    const mockHeadingIssues = [{ id: 1, description: 'Heading issue' }];
    const mockImageIssues = [{ id: 2, description: 'Image issue' }];
    (headingAnalysisService.analyzeHeadings as jest.Mock).mockReturnValue(mockHeadingIssues);
    (imageAnalysisService.analyzeImages as jest.Mock).mockReturnValue(mockImageIssues);

    // Call the analyzeFile method
    const result = await fileUploadService.analyzeFile(mockFilePath);

    // Assertions
    expect(result.complianceScore).toBe(80);  // Based on 2 issues, score should be 100 - 2 * 10 = 80
    expect(result.issues).toEqual([...mockHeadingIssues, ...mockImageIssues]);

    // Ensure fs.readFileSync was called with the correct file path
    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, 'utf-8');

    // Ensure the analysis services were called correctly
    expect(headingAnalysisService.analyzeHeadings).toHaveBeenCalled();
    expect(imageAnalysisService.analyzeImages).toHaveBeenCalled();
  });

  it('should handle errors if the file is not readable', async () => {
    // Mock fs.readFileSync to throw an error
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File read error');
    });

    const mockFilePath = './test-file.html';

    // Call the analyzeFile method and expect it to throw an error
    await expect(fileUploadService.analyzeFile(mockFilePath)).rejects.toThrow('File read error');
  });
});
