export type SineWaveFieldProps = {
  /** Horizontal scroll / phase speed — higher is faster. Default 0.35 */
  speed?: number;
  /** Wave peak height in px. Default 28 */
  amplitude?: number;
  /** Number of floating cards along the wave. Default 4 */
  cardCount?: number;
  /** Extra vertical shift of the whole field in px. Default 0 */
  verticalOffset?: number;
  /** Extra gentle bob amplitude for cards (5–10). Default 7 */
  cardFloatAmplitude?: number;
  /** Wavelength in px (distance of one full sine cycle). Default 420 */
  wavelength?: number;
  /** Optional card content — cycles if fewer than cardCount */
  cards?: WaveCardData[];
  className?: string;
};

export type WaveCardData = {
  /** Display number inside the circle, e.g. "01". Auto-filled if omitted. */
  number?: string;
  title: string;
  description: string;
};

export type WaveSample = {
  x: number;
  y: number;
};
