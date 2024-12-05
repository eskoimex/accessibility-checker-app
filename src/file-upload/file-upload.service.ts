// import { Injectable } from '@nestjs/common';
// import * as fs from 'fs';
// import * as cheerio from 'cheerio';

// @Injectable()
// export class FileUploadService {
//   async analyzeFile(filePath: string) {
//     const fileContent = fs.readFileSync(filePath, 'utf-8');
//     const $ = cheerio.load(fileContent);

//     const issues = [];
//     let score = 100;

//     // Missing alt attributes in <img>
//     $('img').each((_, el) => {
//       if (!$(el).attr('alt')) {
//         issues.push({
//           type: 'Missing Alt Attribute',
//           suggestion: 'Add a descriptive alt attribute to the image.',
//           element: $(el).toString(),
//         });
//         score -= 10;
//       }
//     });

//     // Skipped heading levels
//     const headingTags = $('h1, h2, h3, h4, h5, h6');
//     let lastLevel = 0;
//     headingTags.each((_, el) => {
//       const level = parseInt(el.tagName.substring(1));
//       if (level > lastLevel + 1) {
//         issues.push({
//           type: 'Skipped Heading Level',
//           suggestion: 'Ensure headings follow a logical order.',
//           element: $(el).toString(),
//         });
//         score -= 10;
//       }
//       lastLevel = level;
//     });

//     return {
//       complianceScore: score,
//       issues,
//     };
//   }
// }
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