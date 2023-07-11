import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';

const BoxDisplay = () => {
  const data = [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}];

  const renderItem = ({item}) => {
    return <View style={styles.box} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingVertical: 10,
  },
  box: {
    width: 100,
    height: 100,
    margin: 10,
    backgroundColor: 'blue',
  },
});

export default BoxDisplay;
