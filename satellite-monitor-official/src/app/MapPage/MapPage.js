import './MapPage.css';

import './MapPage.css';
import React, { Fragment } from 'react';

import Layout from '../packages/shared/layouts';
import MapActions from './components/MapActions';
import MapContent from './components/MapContent';

export default function MapPage() {
    return (
        <Fragment>
            <Layout>
                <MapActions />                
                    <MapContent />
            </Layout>
        </Fragment>
    )
}
