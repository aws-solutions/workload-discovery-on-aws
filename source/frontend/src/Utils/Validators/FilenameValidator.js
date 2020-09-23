export const filenameValidator = input => {
  try {
    if (input.length > 64) {
      return {
        valid: false,
        reason: `name should be less than 64 characters. It is currently at ${input.length} characters`,
        input: input
      };
    }

    if (!input.match(`^[^<>:;,?"*|/]+$`))
      return {
        valid: false,
        reason: `name could cause problems on your file system remove any of these ^<>:;,?"*|/`,
        input: input
      };

    return { valid: true, input: input };
  } catch (e) {
    return { valid: false, input: input };
  }
};
