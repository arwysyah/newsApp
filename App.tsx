import React, {ReactNode} from 'react';
import {store} from './src/redux/store';

import {Provider} from 'react-redux';
import IndexNavigation from './src/navigations/index';

const App: ReactNode = () => {
  return (
    <>
      <Provider store={store}>
        <IndexNavigation />
      </Provider>
    </>
  );
};
export default App;
