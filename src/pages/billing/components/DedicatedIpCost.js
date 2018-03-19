import config from 'src/config';

export default function DedicatedIpCost({ quantity, isAWSAccount }) {
  return isAWSAccount
    ? `$${(config.sendingIps.awsPricePerIp * quantity).toFixed(3)} per hour`
    : `$${(config.sendingIps.pricePerIp * quantity).toFixed(2)} per month`;
}
