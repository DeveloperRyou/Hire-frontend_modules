import { Button } from '@mui/material';
import { Lang, Translation } from 'fe-modules/models/lang';

const SignatureClearLabel: { clear: Translation } = {
  clear: {
    kr: 'clear',
    zh: '擦除',
    en: 'clear',
  },
};

interface SignSubmitProps {
  lang: Lang;
  onClick: () => void;
}

export default function SignClear({ lang, onClick }: SignSubmitProps) {
  return (
    <Button sx={{ width: '100%', color: 'grey' }} onClick={onClick}>
      {SignatureClearLabel.clear[lang as keyof Translation]}
    </Button>
  );
}
