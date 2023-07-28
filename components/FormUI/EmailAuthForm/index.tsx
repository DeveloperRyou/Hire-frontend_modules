import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { getVerificationConfirmClient, postVerificationSendClient } from 'fe-modules/apis/client/verification';
import FlexBox from 'fe-modules/components/basic/FlexBox';
import EmailAuthButton from 'fe-modules/components/FormUI/EmailAuthForm/EmailAuthButton';
import EmailAuthCode from 'fe-modules/components/FormUI/EmailAuthForm/EmailAuthCode';
import EmailAuthResendButton from 'fe-modules/components/FormUI/EmailAuthForm/EmailAuthResendButton';
import TextInput from 'fe-modules/components/FormUI/TextForm/TextInput';
import { FormUIProps } from 'fe-modules/models/FormUI/FormUI';
import { Translation } from 'fe-modules/models/lang';
import { useController } from 'react-hook-form';

function EmailAuthForm({ form, uiSetting, lang }: FormUIProps) {
  const name = uiSetting.FormItem_id;
  let langApi: string; // API 발송용 언어
  switch (lang) {
    case 'kr':
      langApi = 'korean';
      break;
    case 'en':
      langApi = 'english';
      break;
    case 'zh':
      langApi = 'chinese';
      break;
    default:
      langApi = 'english';
  }

  const [, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isSented, setIsSented] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const { field: saveDirField } = useController({
    name: `saveDir`,
    control: form.control,
  });

  const { field: emailField, fieldState: emailFieldState } = useController({
    name: name,
    control: form.control,
    rules: {
      required: uiSetting.rule?.required,
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/g,
        message: 'email pattern mismatch',
      },
    },
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    emailField.onChange(e.target.value);
    setIsVerified(false);
    setIsSented(false);
  };

  const onVerify = async () => {
    const emailValue = emailField.value;
    setEmail(emailValue);
    try {
      await postVerificationSendClient(emailValue, langApi);
      setIsSented(true);
      setIsInvalid(false);
    } catch (error) {
      setIsSented(false);
      setIsInvalid(true);
    }
  };

  const onConfirm = async () => {
    const emailValue = emailField.value;
    setEmail(emailValue);
    try {
      const res = await getVerificationConfirmClient(emailValue, code);
      if (res.status !== 200) throw new Error('email confirm failed');
      setIsVerified(true);
      emailField.onChange(emailValue);
      saveDirField.onChange(name);
      setIsInvalid(false);
    } catch (error) {
      setIsVerified(false);
      setIsInvalid(true);
    }
  };

  return (
    <FlexBox sx={{ flexDirection: 'column', gap: 2, display: uiSetting.rule?.invisible ? 'none' : '' }}>
      <Box sx={style.box}>
        <TextInput
          field={emailField}
          fieldState={emailFieldState}
          multiline={false}
          disabled={(uiSetting.rule?.readonly ?? false) || isVerified}
          onCustomChange={onChange}
        />
        <EmailAuthButton
          isInvalid={emailFieldState.invalid ?? false}
          isVerified={isVerified}
          isSented={isSented}
          onVerify={onVerify}
          lang={lang}
        />
        {isSented && !isVerified && (
          <EmailAuthCode
            name={name}
            code={code}
            setCode={setCode}
            onConfirm={onConfirm}
            isInvalid={isInvalid}
            lang={lang}
          />
        )}
      </Box>
      {isSented && !isVerified && <Typography variant="caption">{Label.인증안내[lang]}</Typography>}
      {isSented && !isVerified && <EmailAuthResendButton onVerify={onVerify} lang={lang} />}
    </FlexBox>
  );
}

export default EmailAuthForm;

const style = {
  box: {
    display: 'grid',
    gridTemplateColumns: 'auto max-content',
    width: '100%',
    gap: 1,
  },
};

const Label: { [key: string]: Translation } = {
  인증실패: {
    kr: '이메일 인증 실패',
    zh: '邮箱验证失败',
    en: 'email verification failed',
  },
  인증안내: {
    kr: '* "인증하기" 버튼을 눌러 이메일을 인증해주세요.',
    zh: '* 请点击“点击验证”按钮来验证您的邮箱。',
    en: '* Press "VERIFY" button to authenticate your email.',
  },
};
