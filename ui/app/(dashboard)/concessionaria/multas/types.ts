export type FiltrosMultaType = {
  vencimentoDe: Date;
  vencimentoAte: Date;
  motivo?: string;
  ocupanteId: number | null;
}