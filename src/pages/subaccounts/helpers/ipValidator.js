import _ from 'lodash';
import { ipRegex } from 'src/helpers/regex';

export default function ipValidator(value) {
  if (!value) {
    return;
  }

  const ips = value.split(',').map(_.trim);
  const invalidIps = ips.filter((ip) => !ipRegex.test(ip));

  if (invalidIps.length) {
    return 'Must be a comma separated list of valid IPs';
  }
}
