import { configureStore } from '../packages/core/adapters/redux-toolkit';

import { positionReducer } from './Position';

const store = configureStore({
    reducer: {
        positionReducer
    },
});

export default store;