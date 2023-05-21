export default function padToOneByte(number: string) {
  // Define the target length for the padded number string.
  const targetLength = 2 // 4 bytes * 2 (each byte has 2 hex characters)

  // If the number string is already at least the target length, return it unchanged.
  if (number.length >= targetLength) {
    return number
  }

  // Calculate the required zero padding.
  const zeroPadding = '0'.repeat(targetLength - number.length)

  // Append the zero padding to the end of the number string and return it.
  return number + zeroPadding
}
