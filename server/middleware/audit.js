import AuditLog from '../models/AuditLog.js';

export const logAuditAction = async ({
  userId,
  userName = 'System',
  role = 'system',
  action,
  entity,
  entityId = '',
  details = '',
  ipAddress = '',
}) => {
  try {
    await AuditLog.create({
      userId,
      userName,
      role,
      action,
      entity,
      entityId,
      details,
      ipAddress,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('[AUDIT LOG ERROR]', err.message);
  }
};
