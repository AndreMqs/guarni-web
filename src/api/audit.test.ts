import { describe, expect, it } from 'vitest';
import { correctExecution, getAuditEvents, getAuditMedia, getLatestAuditCorrection } from './audit';

describe('audit api mock', () => {
  it('orders events by full timestamp, newest first, and identifies their subjects', async () => {
    const events = await getAuditEvents({ category: 'all' });
    expect(events.map(event => event.id)).toEqual(['audit-6', 'audit-5', 'audit-2', 'audit-4', 'audit-3', 'audit-1']);
    expect(events.every(event => Boolean(event.subject && event.occurredAt))).toBe(true);
  });
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
    const correction = await correctExecution({ newReason: 'Motivo corrigido', correctionReason: 'Validação com a equipe', taskTitle: 'Conferir entrega' });
    expect((await getAuditEvents({ category: 'all' }))[0]).toMatchObject({ id: correction.id, subject: 'Conferir entrega' });
    const receipt = await getLatestAuditCorrection();

    expect(receipt.correction.newReason).toBe('Motivo corrigido');
    expect(receipt.correction.correctionReason).toBe('Validação com a equipe');
  });
});
