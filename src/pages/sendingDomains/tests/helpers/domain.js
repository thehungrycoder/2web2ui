export const domain = {
  id: 'example.com',
  is_default_bounce_domain: true,
  dkim: {
    headers: 'from:to:subject:date',
    public: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCH3n8S0ApNBowLfcKzQMK2KamxMC2TmMTVwwh9E0DQihCUxjieg9OdWwPP16osG95XoawSFCg114qTXX+UsPE40YpURpntKKa2XPLhEJYb5690yf7h0MmrqCkMTJbW23783gqZ/OUO6DGjTcNcvfWw4gn3t1jLyGl8Nk6EdAXVlQIDAQAB',
    selector: 'scph0116'
  },
  status: {
    mx_status: 'valid',
    spf_status: 'invalid',
    cname_status: 'unverified',
    ownership_verified: true,
    abuse_at_status: 'unverified',
    compliance_status: 'valid',
    verification_mailbox_status: 'valid',
    dkim_status: 'invalid',
    postmaster_at_status: 'unverified'
  },
  shared_with_subaccounts: false
};

export const verificationCases = {
  unverified: { status: 'unverified' },
  pending: { status: 'pending' },
  verified: { status: 'verified' },
  blocked: { status: 'blocked' }
};
