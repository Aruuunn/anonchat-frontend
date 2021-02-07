import {arrayBufferToString, binaryStringToArrayBuffer} from '@privacyresearch/libsignal-protocol-typescript/lib/helpers';
import {SignalService} from '../projects/signal/src/lib/signal.service';
import {
  convertAllArrayBufferToString,
  convertAllBufferStringToArrayBuffer,
  ARRAY_BUFFER_PREFIX_REGEX
} from '../projects/signal/src/lib/utils/array-buffer.utils';

describe('Array Buffer Utils', () => {
  const buffer1 = new Uint8Array([1, 2, 3, 4]).buffer;
  const buffer2 = new Uint8Array([5, 6, 7, 8]).buffer;
  const buffer3 = new Uint8Array([1, 10, 22]).buffer;


  const objectWithBufferProp = {
    a: buffer1,
    b: {
      c: buffer2,
      d: {
        e: buffer3
      }
    }
  };
  it('Should be able to convert from and to Array Buffer', () => {
    const buffer = new Uint8Array([1, 2, 3, 4]).buffer;

    expect(binaryStringToArrayBuffer(arrayBufferToString(buffer))).toEqual(buffer);
  });

  it('Should convert all ArrayBuffer to String with the prefix', () => {
    const result = (convertAllArrayBufferToString(objectWithBufferProp));

    const test = (obj: any) => {
      if (!obj) {
        return;
      }
      for (const key of Object.keys(obj)) {
        expect(obj[key] instanceof ArrayBuffer).not.toBeTrue();
        if (typeof obj[key] === 'object') {
          test(obj[key]);
        }
      }
    };

    test(result);

  });


  it('Should convert all Buffer Strings to ArrayBuffer', () => {
    const result = convertAllBufferStringToArrayBuffer(convertAllArrayBufferToString(objectWithBufferProp));
    console.log(result);
    const test = (obj: any) => {
      if (!obj) {
        return;
      }
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'string') {
          console.log(key);
          // expect(obj[key]).not.toMatch(ARRAY_BUFFER_PREFIX_REGEX);
        } else if (typeof obj[key] === 'object') {
          test(obj[key]);
        }
      }
    };

    test(result);

  });

  it('Should be able to convert all array buffers in object to and from string', () => {
    console.log(JSON.stringify((convertAllArrayBufferToString(objectWithBufferProp))));
    expect(convertAllBufferStringToArrayBuffer(convertAllArrayBufferToString(objectWithBufferProp)))
      .toEqual(jasmine.objectContaining(objectWithBufferProp));
  });
});
