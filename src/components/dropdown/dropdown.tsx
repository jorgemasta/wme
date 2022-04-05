import React from 'react';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import {
  FormControl,
  FormHelperText,
  OutlinedInput,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import InputTitle from '../input-title';

/**
 * Dropdown should use the WME version of MenuItem to allow for custom styling and icons.
 */

interface WmeDropdownProps {
  children: any,
  value?: (string | number)[],
  onChange?: any,
  selectValue?: string,
  helperText?: string,
  labelText?: string,
}

const WmeSelect = styled(Select, {
  name: 'WmeSelect',
  slot: 'Root',
})(({ theme }) => ({
  color: theme.palette.text.disabled,
  '& .MuiSelect-select': {
    '& .Wme-selected-text': {
      color: theme.palette.text.primary,
    },
  },
  '&.Mui-focused': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.text.primary,
      borderWidth: 1,
    },
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 24;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 415,
      top: 96,
    },
  },
};

const Dropdown: React.FC<WmeDropdownProps> = (props) => {
  const {
    children,
    value,
    onChange,
    selectValue,
    helperText,
    labelText,
  } = props;

  const childrenWithIcons = children.map((child: any) => {
    if (value?.includes(child.props.value)) {
      return React.cloneElement(child, { icon: <CheckIcon /> });
    }
    return child;
  });

  return (
    <FormControl sx={{ m: 1, width: 415, mt: 3 }}>
      {
        labelText
        && (
          <InputTitle>
            {labelText}
          </InputTitle>
        )
      }
      <WmeSelect
        multiple
        displayEmpty
        value={value}
        onChange={onChange}
        input={<OutlinedInput />}
        renderValue={(selected: any) => {
          if (selected.length === 0) {
            return selectValue;
          }

          return <span className="Wme-selected-text">{selected.join(', ')}</span>;
        }}
        MenuProps={MenuProps}
      >
        {childrenWithIcons}
      </WmeSelect>
      {
        helperText
        && (
          <FormHelperText sx={{ fontSize: 10, marginLeft: 0 }}>
            {helperText}
          </FormHelperText>
        )
      }
    </FormControl>
  );
};

export default Dropdown;
