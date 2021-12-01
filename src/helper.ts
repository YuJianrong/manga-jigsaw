export const piece = {
  height: 0,
  width: 0,
};
export enum PieceType {
  PIECE_LEFT = 1,
  PIECE_TOP = 2,
  PIECE_RIGHT = 3,
  PIECE_BOTTOM = 4,
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const fill2 = (v: number) => (v < 10 ? `0${v}` : v);
  return `${y}${fill2(m)}${fill2(d)}${fill2(h)}${fill2(minute)}${fill2(second)}`;
}

export function getElement<T = HTMLElement>(id: string): T {
  return document.getElementById(id) as unknown as T;
}

export async function wait(ms = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
