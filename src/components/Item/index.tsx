import { Text, View } from 'react-native';

import { styles } from './styles';

export type ItemProps = {
  name: string;
  percentage: string;
}

type Props = {
  data: ItemProps;
}

export function Item({ data }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.containerPercentage}>
        <Text style={styles.percentage}>
          {data.percentage}
        </Text>
      </View>

      <Text style={styles.title}>
        {data.name}
      </Text>
    </View>
  );
}