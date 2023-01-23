import React from 'react';
import { shallow } from 'enzyme';
import Weather from '../src/components/Weather';

import Adapter from 'enzyme-adapter-react-16';

describe('Weather', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Weather />);
    });

    it('should render the current temperature and city when data is present', () => {
        wrapper.setState({
            data: {
                temp: 72,
                name: 'Durban'
            }
        });
        expect(wrapper.find('.temp').text()).toEqual('72°');
        expect(wrapper.find('.name').text()).toEqual('Durban');
    });
});