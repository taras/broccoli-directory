import Directory from './directory';

export default function $(path) {
  return new Directory(path);
}
