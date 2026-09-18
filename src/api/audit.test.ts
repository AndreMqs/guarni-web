import { describe, expect, it } from 'vitest';
import { correctExecution, getAuditEvents, getAuditMedia, getLatestAuditCorrection } from './audit';

describe('audit api mock', () => {
  it('combines category and date-range filters', async () => {
    const events = await getAuditEvents({
      category: 'media',
      startDate: '2026-09-01',
      endDate: '2026-09-01',
    });

    expect(events.length).toBeGreaterThan(0);
    expect(events.every((event) => event.category === 'media' && event.occurredOn === '2026-09-01')).toBe(true);
  });

  it('filters media by expiration window', async () => {
    const expiring = await getAuditMedia('expiring');
    expect(expiring.every((item) => item.daysUntilExpiry <= 7)).toBe(true);
  });

  it('exposes the latest correction through a queryable api contract', async () => {
    await correctExecution({ newReason: 'Motivo corrigido', correctionReason: 'Validação com a equipe' });
    const receipt = await getLatestAuditCorrection();

    expect(receipt.correction.newReason).toBe('Motivo corrigido');
    expect(receipt.correction.correctionReason).toBe('Validação com a equipe');
  });
});
