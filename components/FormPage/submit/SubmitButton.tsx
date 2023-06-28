import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'next-i18next';
import SubmitModal from 'fe-modules/components/FormPage/submit/SubmitModal';
import getRedirect from 'fe-modules/components/FormPage/submit/getRedirect';
import isReady from 'fe-modules/components/FormPage/submit/isReady';
import onSubmitForm from 'fe-modules/components/FormPage/submit/onSubmitForm';
import { useModal } from 'fe-modules/hooks/useModal';
import { Lang } from 'fe-modules/models/lang';
import { FormUIUseFormReturn } from 'fe-modules/models/FormUI/FormUI';
import { Auth } from 'fe-modules/models/auth';
import { FormPageProps } from 'fe-modules/models/FormPage/FormPage';

interface Props {
  form: FormUIUseFormReturn;
  page: FormPageProps;
  auth: Auth;
}

function FormSubmitButton({ form, page, auth }: Props) {
  const { t, i18n } = useTranslation(['customForm', 'form', 'common']);
  const { openModal } = useModal();
  const [loading, setLoading] = useState(false);

  const { handleSubmit, formState, reset, watch } = form;

  const submitSuccess = async () => {
    setLoading(true);
    const curData = watch();
    const res = await onSubmitForm(curData, page.forms, auth);
    if (res.status === 200) {
      localStorage.removeItem(page.path);
      const onRedirect = getRedirect(curData, page.redirect as string);
      openModal(<SubmitModal onClick={onRedirect} preset="성공" translation={t} />, { width: '60%' });
    } else {
      console.log(res);
      openModal(<SubmitModal preset="실패" translation={t} />, { width: '60%' });
    }
    reset(curData, {
      keepDefaultValues: true,
    });
    setLoading(false);
  };

  const buttonContent = loading ? (
    <CircularProgress />
  ) : page.submit ? (
    page.submit.label[i18n.language as Lang]
  ) : (
    t(`버튼`)
  );

  return (
    <Button
      variant="contained"
      sx={{ width: '100%', mt: 3, display: isReady(page.submit.conditions, watch) ? 'none' : undefined }}
      disabled={(!formState.isValid || loading) && false}
      onClick={async (e) => {
        console.log('[Submissions]\n', form.watch());
        console.log('[Settings]\n', page.forms);

        return handleSubmit(submitSuccess, () => {
          console.log('submit failed');
        })(e);
      }}
    >
      {buttonContent}
    </Button>
  );
}

export default FormSubmitButton;