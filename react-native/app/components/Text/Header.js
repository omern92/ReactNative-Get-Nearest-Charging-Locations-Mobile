import React from 'react';
import { Text } from 'react-native';
import styles from './styles';

const Header = (props) => (
  <Text style={styles.header}>{props.children}</Text>
);

export default Header;
