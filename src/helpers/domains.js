export const resolveReadyFor = ({ ownership_verified, cname_status, dkim_status, mx_status }) => ({
  sending: ownership_verified,
  bounce: mx_status === 'valid' || cname_status === 'valid',
  dkim: dkim_status === 'valid'
});

export const resolveStatus = ({ ownership_verified, compliance_status }) => {
  if (!ownership_verified) {
    return 'unverified';
  } else if (compliance_status === 'valid') {
    return 'verified';
  } else {
    return compliance_status;
  }
};
