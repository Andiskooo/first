import type { InstallationMetadata } from './parser';

/** Keys are original folder/groupKey pairs, independent of photo sequence numbers.
 * Pin a published slug here before renaming source files or changing specifications.
 * Only enter verified facts; relatedProductIds must identify the actual installed model.
 */
export interface ProjectEditorial {
  slug?: string;
  title?: string;
  description?: string[];
  municipality?: string;
  metadata?: Partial<InstallationMetadata>;
  buildingType?: string;
  updatedAt?: string;
  relatedProductIds?: string[];
  imageAlts?: Record<string, string>;
}

export const projectEditorial: Record<string, ProjectEditorial> = {};

// These are separate municipalities, not Prishtinë/Gjakovë neighbourhoods.
// Has is retained under its source collection: the name alone is ambiguous.
export function projectMunicipality(folder: string, locality: string | null) {
  return locality === 'Rahovec' || locality === 'Graçanicë' ? locality : folder;
}
