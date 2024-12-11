import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import Issue from '../interface/issue';

@Injectable()
export class UniqueIdAnalysisService {
  analyzeUniqueIds($: cheerio.CheerioAPI): Issue[] {
    const issues: Issue[] = [];
    const ids: Record<string, number> = {};

    // Collect all elements with an ID attribute
    $('[id]').each((_, element) => {
      const id = $(element).attr('id');
      if (id) {
        if (ids[id]) {
          // If the ID already exists, increment its count
          ids[id]++;
        } else {
          // Otherwise, initialize the ID count
          ids[id] = 1;
        }
      }
    });

    // Check for duplicate IDs
    Object.keys(ids).forEach((id) => {
      if (ids[id] > 1) {
        issues.push({
          type: 'Duplicate ID',
          description: `The ID "${id}" is used ${ids[id]} times.`,
          severity: 'high',
          element: null, // Optional: Add element context if required
          suggestion: `Ensure the ID "${id}" is unique.`,
        });
      }
    });

    return issues;
  }
}
