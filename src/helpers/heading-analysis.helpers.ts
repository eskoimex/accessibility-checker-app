import { Injectable } from '@nestjs/common';
import { load } from 'cheerio';
import Issue  from '../interface/issue';

@Injectable()
export class HeadingAnalysisService {
  analyzeHeadings($: ReturnType<typeof load>): Issue[] {
    const issues: Issue[] = [];
    let lastLevel = 0;

    $('h1, h2, h3, h4, h5, h6').each((_, el) => {
      const level = parseInt(el.tagName.substring(1));
      if (level > lastLevel + 1) {
        issues.push({
          type: 'Skipped Heading Level',
          suggestion: 'Ensure headings follow a logical order.',
          element: $(el).toString()
        });
      }
      lastLevel = level;
    });

    return issues;
  }
}