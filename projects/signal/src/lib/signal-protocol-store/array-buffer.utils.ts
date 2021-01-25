export function arrayBufferToString(b: ArrayBuffer): string {
  return uint8ArrayToString(new Uint8Array(b));
}

export function uint8ArrayToString(arr: Uint8Array): string {
  const end = arr.length;
  let begin = 0;
  if (begin === end) {
    return '';
  }
  let chars: number[] = [];
  const parts: string[] = [];
  while (begin < end) {
    chars.push(arr[begin++]);
    if (chars.length >= 1024) {
      parts.push(String.fromCharCode(...chars));
      chars = [];
    }
  }
  return parts.join('') + String.fromCharCode(...chars);
}
