import { filenameValidator } from '../../../Utils/Validators/FilenameValidator';

test('filename with ; fails', () => {
  const input = 'this;isafilename'

  const valid = filenameValidator(input);
  expect(valid).toEqual({
    valid: false,
    reason: `name could cause problems on your file system remove any of these ^<>:;,?"*|/`,
    input: input
  });
});

test('filename with < fails', () => {
  const input = 'this<isafilename'

  const valid = filenameValidator(input);
  expect(valid).toEqual({
    valid: false,
    reason: `name could cause problems on your file system remove any of these ^<>:;,?"*|/`,
    input: input
  });
});

test('filename with > fails', () => {
  const input = 'this>isafilename'

  const valid = filenameValidator(input);
  expect(valid).toEqual({
    valid: false,
    reason: `name could cause problems on your file system remove any of these ^<>:;,?"*|/`,
    input: input
  });
});

test('filename with : fails', () => {
  const input = 'this:isafilename'

  const valid = filenameValidator(input);
  expect(valid).toEqual({
    valid: false,
    reason: `name could cause problems on your file system remove any of these ^<>:;,?"*|/`,
    input: input
  });
});

test('filename with , fails', () => {
  const input = 'this,isafilename'

  const valid = filenameValidator(input);
  expect(valid).toEqual({
    valid: false,
    reason: `name could cause problems on your file system remove any of these ^<>:;,?"*|/`,
    input: input
  });
});

test('filename with ? fails', () => {
  const input = 'this?isafilename'

  const valid = filenameValidator(input);
  expect(valid).toEqual({
    valid: false,
    reason: `name could cause problems on your file system remove any of these ^<>:;,?"*|/`,
    input: input
  });
});

test('filename with " fails', () => {
  const input = 'this"isafilename'

  const valid = filenameValidator(input);
  expect(valid).toEqual({
    valid: false,
    reason: `name could cause problems on your file system remove any of these ^<>:;,?"*|/`,
    input: input
  });
});

test('filename with * fails', () => {
  const input = 'this*isafilename'

  const valid = filenameValidator(input);
  expect(valid).toEqual({
    valid: false,
    reason: `name could cause problems on your file system remove any of these ^<>:;,?"*|/`,
    input: input
  });
});

test('filename with | fails', () => {
  const input = 'this|isafilename'

  const valid = filenameValidator(input);
  expect(valid).toEqual({
    valid: false,
    reason: `name could cause problems on your file system remove any of these ^<>:;,?"*|/`,
    input: input
  });
});

test('filename with / fails', () => {
  const input = 'this/isafilename'

  const valid = filenameValidator(input);
  expect(valid).toEqual({
    valid: false,
    reason: `name could cause problems on your file system remove any of these ^<>:;,?"*|/`,
    input: input
  });
});

test('filename with too many chars > 64', () => {
  const input = 'name could cause problems on your file system remove any of these'

  const valid = filenameValidator(input);
  expect(valid).toEqual({
    valid: false,
    reason: `name should be less than 64 characters. It is currently at 65 characters`,
    input: input
  });
});

test('filename which is valid', () => {
  const input = 'myFilename'

  const valid = filenameValidator(input);
  expect(valid).toEqual({
    valid: true,
    input: input
  });
});

test('filename which is undefined', () => {
    const input = undefined
  
    const valid = filenameValidator(input);
    expect(valid).toEqual({
      valid: false,
      input: input
    });
  });

  test('filename where event is undefined', () => {
    const input = undefined;
  
    const valid = filenameValidator(input);
    expect(valid).toEqual({
      valid: false,
      input: input
    });
  });
