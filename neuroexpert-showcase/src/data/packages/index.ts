export { smallBusinessPackages } from './small-business';
export { mediumBusinessPackages } from './medium-business';
export { largeBusinessPackages } from './large-business';

export function getPackagesBySegment(segment: string | string[] | undefined) {
  const key = Array.isArray(segment) ? segment[0] : segment;
  switch (key) {
    case 'small':
      return require('./small-business').smallBusinessPackages;
    case 'medium':
      return require('./medium-business').mediumBusinessPackages;
    case 'large':
      return require('./large-business').largeBusinessPackages;
    default:
      return [];
  }
}