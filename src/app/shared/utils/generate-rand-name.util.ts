import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

export function getRandomName(): string {
  return uniqueNamesGenerator({
    style: 'capital',
    separator: ' ',
    dictionaries: [colors, animals],
    length: 2,
  });
}
