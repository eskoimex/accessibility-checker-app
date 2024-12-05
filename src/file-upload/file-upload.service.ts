import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import { HeadingAnalysisService } from '../helpers/heading-analysis.helpers';
import Issue  from '../interface/issue';
import { ImageAnalysisService } from '../helpers/image-analysis.helpers';

@Injectable()
export class FileUploadService {
  constructor(
    private headingAnalysisService: HeadingAnalysisService,
    private imageAnalysisService: ImageAnalysisService
  ) {}

  async analyzeFile(filePath: string): Promise<{ complianceScore: number; issues: Issue[] }> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const $ = cheerio.load(fileContent);

      const headingIssues = this.headingAnalysisService.analyzeHeadings($);
      const imageIssues = this.imageAnalysisService.analyzeImages($);
      const issues = [...headingIssues, ...imageIssues];

      const score = this.calculateComplianceScore(issues);

      return {
        complianceScore: score,
        issues
      };
    } catch (error) {
      console.error('Error analyzing file:', error);
      throw error;
    }
  }

  private calculateComplianceScore(issues: Issue[]): number {
    let score = 100;
    for (const issue of issues) {
      score -= 10;
    }
    return score;
  }
}