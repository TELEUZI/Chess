export default function generateRandomString(): string {
  return Math.random().toString(36).substring(33) + Math.random().toString(36).substring(33);
}
