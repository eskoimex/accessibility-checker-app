import { Injectable } from '@nestjs/common';
import { load } from 'cheerio';
import Issue  from '../interface/issue';

@Injectable()
export class ImageAnalysisService {
  analyzeImages($: ReturnType<typeof load>): Issue[] {
    const issues: Issue[] = [];

    $('img').each((_, el) => {
      if (!$(el).attr('alt')) {
        issues.push({
          type: 'Missing Alt Attribute',
          suggestion: 'Add a descriptive alt attribute to the image.',
          element: $(el).toString()
        });
      }
    });

    return issues;
  }
}