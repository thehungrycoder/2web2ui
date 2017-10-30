import { shallow } from 'enzyme';
import React from 'react';

import { CreatePage } from '../CreatePage';

let wrapper, props;

describe('Template CreatePage', ()=> {
  beforeEach( () => {
    props = {
      id: null,
      loading: false,
      template: {
        draft: {}
      },
      getDraft: jest.fn(() => Promise.resolve()),
      match: {
        params: {}
      },
      handleSubmit: jest.fn()
    };
  });

  describe('New Template', ()=> {
    beforeEach(()=> {
      wrapper = shallow(<CreatePage {...props} />);
    });

    it('should render correctly', ()=> { 
      expect(wrapper).toMatchSnapshot();
    });

    it('should not call getDraft (load template)', () => {
      expect(props.getDraft).not.toHaveBeenCalled();
    });
  });
 
  describe('Duplicate Template', ()=> {
     beforeEach(()=> {
      props.match.params.id = 100;
      wrapper = shallow(<CreatePage {...props} />);
    });

    it('should render correctly', ()=> {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not call getDraft (load template)', () => {
      expect(props.getDraft).toHaveBeenCalled();
    });
  });
 
});
