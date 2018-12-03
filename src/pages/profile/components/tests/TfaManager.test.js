import { shallow } from 'enzyme';
import React from 'react';
import { TfaManager } from '../TfaManager';

describe('EnableTfaModal tests', () => {
  let wrapper;
  let instance;
  let props;

  beforeEach(() => {
    props = {
      getTfaBackupStatus: jest.fn(),
      getTfaStatus: jest.fn(),
      getTfaSecret: jest.fn(),
      clearBackupCodes: jest.fn(),
      generateBackupCodes: jest.fn().mockImplementation(() => Promise.resolve(null)),
      toggleTfa: jest.fn().mockImplementation(() => Promise.resolve(null)),
      enabled: false,
      required: false,
      secret: 'shhh',
      username: 'kevin-mitnick',
      togglePending: false,
      toggleError: false,
      backupCodes: { activeCount: 1 },
      statusUnknown: false
    };

    wrapper = shallow(<TfaManager {...props} />);
    instance = wrapper.instance();
  });

  it('should render correctly', () => {
    expect(instance.props.getTfaBackupStatus).toHaveBeenCalled();
    expect(instance.props.getTfaStatus).not.toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should show panel loading while status unknown', () => {
    wrapper.setProps({ statusUnknown: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call getTfaStatus when statusUnknown at mount', () => {
    props.statusUnknown = true;
    shallow(<TfaManager {...props} />);
    expect(instance.props.getTfaBackupStatus).toHaveBeenCalled();
    expect(instance.props.getTfaStatus).toHaveBeenCalled();
  });

  it('should toggle status text when enabled', () => {
    wrapper.setProps({ enabled: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show a message about 0 codes', () => {
    wrapper.setProps({ enabled: true, backupCodes: { activeCount: 0 }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should refresh backup code status after enable', () => {
    instance.onEnable();
    expect(instance.props.getTfaBackupStatus).toHaveBeenCalled();
  });

  it('should toggleTfa on disable', () => {
    instance.disable('pw');
    expect(instance.props.toggleTfa).toHaveBeenCalledWith({ enabled: false, password: 'pw' });
  });

  it('should generate back codes on request', () => {
    instance.generateBackupCodes('password');
    expect(instance.props.generateBackupCodes).toHaveBeenCalled();
  });

  it('should refresh backup code status after generation', () => {
    instance.generateBackupCodes('code');
    expect(instance.props.getTfaBackupStatus).toHaveBeenCalled();
  });

  it('should close modal when closing backup modal', () => {
    jest.spyOn(instance, 'closeModals');
    wrapper.find('BackupCodesModal').simulate('close');
    expect(instance.closeModals).toHaveBeenCalled();
  });

  it('should close enable modal on close', () => {
    wrapper.find('EnableTfaModal').simulate('close');
    expect(wrapper.state('openModal')).toEqual(null);
    wrapper.find('DisableTfaModal').simulate('close');
    expect(wrapper.state('openModal')).toEqual(null);
  });

  it('should not allow disable when required', () => {
    wrapper.setProps({ enabled: true, required: true });
    const actions = wrapper.find('Panel').props().actions;
    expect(actions).toHaveLength(1);
    expect(actions[0].content).not.toContain('Disable');
  });
});

