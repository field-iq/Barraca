export function roundUpToThousand(amount: number): number {
  return Math.ceil(amount / 1000) * 1000;
}
