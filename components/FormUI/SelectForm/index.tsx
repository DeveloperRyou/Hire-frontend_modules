import React, { useEffect, useState } from 'react';
import { FormGroup } from '@mui/material';
import SelectCheckbox from 'fe-modules/components/FormUI/SelectForm/SelectCheckbox';
import SelectLabel from 'fe-modules/components/FormUI/SelectForm/SelectLabel';
import SelectText from 'fe-modules/components/FormUI/SelectForm/SelectText';
import { FormUIProps } from 'fe-modules/models/FormUI/FormUI';
import { Select_FormUIData } from 'fe-modules/models/FormUI/FormUIData';
import { useController } from 'react-hook-form';

export default function SelectForm({ form, uiSetting, lang, multiple }: FormUIProps & { multiple?: boolean }) {
  const formData = uiSetting.data as Select_FormUIData;
  const { field } = useController({
    name: uiSetting.formKey,
    control: form.control,
    rules: {
      required: uiSetting.rule?.required,
    },
  });

  useEffect(() => {
    if (uiSetting.rule?.default && uiSetting.defaultValue) {
      setState(formData.options.map((val) => (uiSetting.defaultValue as string[]).includes(val!.name)));
    }
  }, [uiSetting.rule?.default, uiSetting.defaultValue]);

  const [state, setState] = useState(Array<boolean>(formData.options.length).fill(false));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(event.target.value);
    let newState: boolean[] = [];
    if (multiple) {
      newState = state.map((val, index) => {
        if (index === num) {
          return !val;
        } else {
          return val;
        }
      });
    } else {
      newState = Array<boolean>(formData.options.length).fill(false);
      newState[num] = true;
    }

    if (multiple) {
      const datas = newState.reduce((prev: string[], cur, index) => {
        if (cur) {
          const options = formData.options[index];
          prev.push(options.name);
        }
        return prev;
      }, []);
      field.onChange(datas);
    } else {
      let data = '';
      newState.forEach((cur, index) => {
        if (cur) data = formData.options[index].name;
      });
      field.onChange(data);
    }
    setState(newState);
  };

  return (
    <FormGroup row={formData?.style === 'horizontal' ? true : false} sx={{ mx: 1 }}>
      {formData.options.map((option, index) => (
        <SelectLabel
          key={index}
          control={
            <SelectCheckbox value={index} isChecked={!!state[index]} multiple={!!multiple} onChange={handleChange} />
          }
          label={<SelectText msg={option?.label?.[lang] ?? ''} />}
          disabled={!!uiSetting.rule?.readonly}
        />
      ))}
    </FormGroup>
  );
}
