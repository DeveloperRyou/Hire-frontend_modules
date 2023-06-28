import React from 'react';
import { FormUISetting } from 'fe-modules/models/FormUI/FormUI';
import { Lang } from 'fe-modules/models/lang';
import { Typography } from '@mui/material';

interface FormSemiTitleProps {
  uiSetting: FormUISetting;
  lang: Lang;
}

function FormSemiTitle({ uiSetting, lang }: FormSemiTitleProps) {
  return (
    <Typography
      variant="body1"
      mb={1}
      px={1}
      dangerouslySetInnerHTML={{
        __html: uiSetting.data.subtitle?.[lang] ?? '',
      }}
    ></Typography>
  );
}

export default FormSemiTitle;