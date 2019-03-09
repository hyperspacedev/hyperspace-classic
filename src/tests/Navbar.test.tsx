import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../components/Navbar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Navbar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
