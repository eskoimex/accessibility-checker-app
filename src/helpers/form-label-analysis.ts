import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import Issue from '../interface/issue';

@Injectable()
export class FormLabelAnalysisService {
  analyzeFormLabels($: cheerio.CheerioAPI): Issue[] {
    const issues: Issue[] = [];

    // Find all form controls that require labels
    $('input, select, textarea').each((_, element) => {
      const $element = $(element);
      const type = $element.attr('type');

      // Skip inputs where labels are not mandatory (e.g., hidden inputs)
      if (type === 'hidden') return;

      const id = $element.attr('id');
      const hasLabel = id ? $(`label[for="${id}"]`).length > 0 : false;

      // Check if the element has an associated label
      if (!hasLabel) {
        issues.push({
          type: 'Missing Label',
          description: `The form control ${$element.toString()} is missing an associated label.`,
          severity: 'medium',
          element: $element.toString(),
          suggestion: 'Ensure all form controls have an associated label.',
        });
      }
    });

    return issues;
  }
}
