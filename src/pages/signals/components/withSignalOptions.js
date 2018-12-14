import { connect } from 'react-redux';
import { changeSignalOptions } from 'src/actions/signalOptions';

const mapDispatchToProps = { changeSignalOptions };
const mapStateToProps = ({ signalOptions }) => signalOptions;

const withSignalOptions = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default withSignalOptions;
