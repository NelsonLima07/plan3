/** Estado normalizado dos chips de status usados em obras e marcos. */
export function statusChipClass(status: string): string {
  switch (status) {
    case 'Concluída':
    case 'concluído':
      return 'bp-chip';
    case 'Em execução':
    case 'em andamento':
      return 'bp-chip bp-chip--accent';
    default:
      return 'bp-chip bp-chip--muted';
  }
}
