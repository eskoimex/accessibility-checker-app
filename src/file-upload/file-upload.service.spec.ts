import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadService } from './file-upload.service';
import { HeadingAnalysisService } from '../helpers/heading-analysis.helpers';
import { ImageAnalysisService } from '../helpers/image-analysis.helpers';
import { UniqueIdAnalysisService } from '../helpers/unique-id-analysis';
import { FormLabelAnalysisService } from '../helpers/form-label-analysis';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import Issue from '../interface/issue';

jest.mock('fs'); // Mock the file system module

describe('FileUploadService', () => {
  let service: FileUploadService;
  let headingAnalysisService: HeadingAnalysisService;
  let imageAnalysisService: ImageAnalysisService;
  let uniqueIdAnalysisService: UniqueIdAnalysisService;
  let formLabelAnalysisService: FormLabelAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        HeadingAnalysisService,
        ImageAnalysisService,
        UniqueIdAnalysisService,
        FormLabelAnalysisService,
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
    headingAnalysisService = module.get<HeadingAnalysisService>(HeadingAnalysisService);
    imageAnalysisService = module.get<ImageAnalysisService>(ImageAnalysisService);
    uniqueIdAnalysisService = module.get<UniqueIdAnalysisService>(UniqueIdAnalysisService);
    formLabelAnalysisService = module.get<FormLabelAnalysisService>(FormLabelAnalysisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeFile', () => {
    it('should analyze file and return issues and compliance score', async () => {
      // Mock file content
      const mockFileContent = `
        <html>
          <head><title>Test</title></head>
          <body>
            <h1>Heading 1</h1>
            <img src="image.jpg">
            <input type="text" id="input1">
          </body>
        </html>
      `;
      jest.spyOn(fs, 'readFileSync').mockReturnValue(mockFileContent);

      // Mock helper services
      const headingIssues: Issue[] = [
        { type: 'Skipped Heading Level', description: 'Heading skipped.', severity: 'low', element: '<h1>', suggestion:"anything" },
      ];
      const imageIssues: Issue[] = [
        { type: 'Missing Alt Attribute', description: 'Alt attribute is missing.', severity: 'medium', element: '<img>', suggestion:"anything"},
      ];
      const uniqueIdIssues: Issue[] = [];
      const formLabelIssues: Issue[] = [
        { type: 'Missing Label', description: 'Input missing label.', severity: 'medium', element: '<input>', suggestion:"anything" },
      ];

      jest.spyOn(headingAnalysisService, 'analyzeHeadings').mockReturnValue(headingIssues);
      jest.spyOn(imageAnalysisService, 'analyzeImages').mockReturnValue(imageIssues);
      jest.spyOn(uniqueIdAnalysisService, 'analyzeUniqueIds').mockReturnValue(uniqueIdIssues);
      jest.spyOn(formLabelAnalysisService, 'analyzeFormLabels').mockReturnValue(formLabelIssues);

      // Call the service method
      const result = await service.analyzeFile('test.html');

      // Assertions
      expect(result.complianceScore).toBe(70); // 100 - (10 for each issue)
      expect(result.issues).toEqual([...headingIssues, ...imageIssues, ...formLabelIssues]);
    });

    it('should throw an error if file cannot be read', async () => {
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('File not found');
      });

      await expect(service.analyzeFile('nonexistent.html')).rejects.toThrow('File not found');
    });
  });

  describe('calculateComplianceScore', () => {
    it('should calculate the compliance score correctly', () => {
      const mockIssues: Issue[] = [
        { type: 'Issue1', description: 'Description1', severity: 'low', element: '<element1>', suggestion:"anything" },
        { type: 'Issue2', description: 'Description2', severity: 'medium', element: '<element2>', suggestion:"anything" },
        { type: 'Issue3', description: 'Description3', severity: 'high', element: '<element3>', suggestion:"anything" },
      ];

      const score = (service as any).calculateComplianceScore(mockIssues);

      expect(score).toBe(70); // 100 - 10 (low) - 10 (medium) - 10 (high)
    });

    it('should return 100 if no issues exist', () => {
      const mockIssues: Issue[] = [];
      const score = (service as any).calculateComplianceScore(mockIssues);
      expect(score).toBe(100);
    });

  });
});
