import type { Tool, VerificationStatus } from '@/types';

const VERIFICATION_THRESHOLD_DAYS = 90;

export function getVerificationStatus(lastVerified: string): VerificationStatus {
  const verifiedDate = new Date(lastVerified);
  const now = new Date();
  const diffMs = now.getTime() - verifiedDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > VERIFICATION_THRESHOLD_DAYS ? 'pending' : 'verified';
}

export function applyVerificationStatus(tool: Tool): Tool {
  const status = getVerificationStatus(tool.lastVerified);
  return {
    ...tool,
    verificationStatus: status,
  };
}

export function applyVerificationToTools(tools: Tool[]): Tool[] {
  return tools.map(applyVerificationStatus);
}

export function getVerificationLabel(status: VerificationStatus): string {
  return status === 'verified' ? '已核验' : '待复核';
}

export function getVerificationHint(tool: Tool): string | null {
  if (tool.verificationStatus === 'pending') {
    return `该工具信息已超过 ${VERIFICATION_THRESHOLD_DAYS} 天未复核，请以官方最新说明为准。`;
  }
  return null;
}
