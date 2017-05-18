import Directory from './lib/directory';

export default function $(path) {
  return new Directory(path);
}