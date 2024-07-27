import React from 'react';
import { View } from 'react-native';
import SectionedMultiSelect, { SectionedMultiSelectProps } from 'react-native-sectioned-multi-select';
import { MaterialIcons as Icon } from '@expo/vector-icons';

type Item = {
  id: string | number;
  name: string;
};

type Props = {
  items: Item[];
  value: (string | number)[];
  onChange: (items: any[]) => void;
} & Partial<SectionedMultiSelectProps<Item>>;

export default function MultiSelect({ items, onChange, value, ...props }: Props) {
  return (
    <View className="mt-4 rounded">
      <SectionedMultiSelect
        //@ts-ignore
        IconRenderer={Icon}
        items={items}
        uniqueKey="id"
        onSelectedItemsChange={onChange}
        selectedItems={value}
        colors={customColors}
        styles={customStyles}
        {...props}
      />
    </View>
  );
}

const customColors = { chipColor: '#4C7031' };

const customStyles = {
  chipContainer: {
    backgroundColor: '#f5f5f5',
  },
  chipsWrapper: {
    paddingTop: 4,
  },
  chipText: {
    fontFamily: 'Inter_400Regular',
  },
  selectToggle: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
  },
};
