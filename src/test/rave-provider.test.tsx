import React from 'react';
// @ts-ignore
import {renderHook, cleanup, act} from '@testing-library/react-hooks';
import {render, fireEvent} from '@testing-library/react';
import RaveProvider from '../rave-provider';
import useRaveScript from '../use-rave-script';
import RavePaymentContent from '../rave-context';
import RavePaymentButton from '../rave-payment-button';

const config = {
  txref: 'rave-123456',
  customer_email: 'user@example.com',
  customer_phone: '234099940409',
  amount: 2000,
  PBFPubKey: 'FLWPUBK-24b72aebb821aea177483039677df9d3-X',
};

describe('<RaveProvider />', () => {
  beforeEach(() => {
    // @ts-ignore
    global.getpaidSetup = jest.fn();
    cleanup();
    document.body.innerHTML = '';
    renderHook(() => useRaveScript(false)); // setup loading for scripts
  });

  it('render-correctly', () => {
    const tree = (
      <RaveProvider {...config} onClose={(): void => {}} onSuccess={(): void => {}}>
        <RavePaymentContent.Consumer>
          {({initializePayment, onClose, onSuccess}): any => (
            <button onClick={(): any => initializePayment(onSuccess, onClose)}>Click</button>
          )}
        </RavePaymentContent.Consumer>
      </RaveProvider>
    );
    const {getByText} = render(tree);
    // Click button
    fireEvent.click(getByText('Click'));
    // @ts-ignore
    expect(global.getpaidSetup).toHaveBeenCalledTimes(1);
  });

  it('render accept the rave payment button', () => {
    const tree = (
      <RaveProvider {...config} onClose={(): void => {}} onSuccess={(): void => {}}>
        <RavePaymentButton>Click</RavePaymentButton>
      </RaveProvider>
    );
    const {getByText} = render(tree);
    // Click button
    fireEvent.click(getByText('Click'));
    // @ts-ignore
    expect(global.getpaidSetup).toHaveBeenCalledTimes(1);
  });
});
