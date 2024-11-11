import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import StorybookUIRoot from './index';

const ToggleStorybook = ({ children }) => {
  const [showStorybook, setShowStorybook] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {showStorybook ? (
        <StorybookUIRoot />
      ) : (
        <View style={{ flex: 1 }}>
          {children}
          <Button title="Show Storybook" onPress={() => setShowStorybook(true)} />
        </View>
      )}
    </View>
  );
};

export default ToggleStorybook;