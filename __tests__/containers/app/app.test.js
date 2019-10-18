import React from 'react';
import { shallow } from "enzyme";

// Components
import AppContainer from '../../../src/containers/app/app';

describe('Proper App Rendering', () => {
  it('Should render AppContainer Component without breaking', () => {
    shallow(<AppContainer />);
  });
});