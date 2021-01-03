import React from 'react';
import renderer, { ReactTestRenderer } from 'react-test-renderer';
import { render, cleanup } from '@testing-library/react';
import Colorpicker from './components/Colorpicker';

afterEach(cleanup);

const props = {
  value: '#fff',
  onChange: jest.fn(),
};

describe('Test Suites ColorPicker', () => {
  let component: ReactTestRenderer;
  beforeAll(() => {
    component = renderer.create(<Colorpicker {...props} />);
  });

  afterAll(() => {
    jest.clearAllMocks();
    component.unmount();
  });

  it('Render component', () => {
    expect(component).toBeTruthy();
  });

  it('Check props', () => {
    expect(component.root.props).toEqual(props);
  });

  it('Check input value', () => {
    const { getByLabelText } = render(<Colorpicker {...props} />);
    const hexInput = getByLabelText('hex');
    const alphaInput = getByLabelText('alpha');

    expect(hexInput.value).toBe('ffffff');
    expect(alphaInput.value).toBe('100');
  });
});
