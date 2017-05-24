import React from 'react';
import * as knobs from '@kadira/storybook-addon-knobs';
import {storiesOf} from '@kadira/storybook';
import {withKnobs} from '@kadira/storybook-addon-knobs';
import {generateKnobs} from 'unmarshaller-generator-storybook-knobs';

import {unmarshaller} from '../unmarshaller';

function Component({config: {name, backgroundColor, textColor}}) {

  const containerStyle = {
    margin: '0 auto',
    width: '40%',
    height: '40%',
    padding: '10%',
    backgroundColor,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.16), 0 2px 5px rgba(0, 0, 0, 0.26)',
    border: '1px solid #eee',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{color: textColor}}>Hi {name}</h1>
    </div>
  );
}

storiesOf('component', module)
  .addDecorator(withKnobs)
  .add('test', () => (
    <Component config={generateKnobs(unmarshaller, knobs)} />
  ));
