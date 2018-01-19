// Convert Sending IP hostnames to and from React prop-safe names

export function encodeIp(ip) { return ip.replace(/\./g, '_'); }
export function decodeIp(encoded) { return encoded.replace(/_/g, '.'); }

