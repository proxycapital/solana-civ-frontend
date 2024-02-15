import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import enUsLocale from "../i18n/locales/en-us";

type ErrorCodeKeys = keyof typeof enUsLocale.errors;

export const ErrorCodes: { [K in ErrorCodeKeys]: K } = {
  ...Object.keys(enUsLocale.errors).reduce((acc, key) => ({ ...acc, [key]: key }), {}),
} as any;

interface HandleError {
  error: any;
  logMessage: string;
  defaultError?: ErrorCodeKeys;
  defaultErrorsParams?: Record<string, string | number | null>;
  closeTimer?: number;
}

export function useError() {
  const { t } = useTranslation();

  function handleError({ logMessage, defaultError, defaultErrorsParams, error, closeTimer }: HandleError) {
    console.log(`${logMessage}: `, error);
    if (error instanceof Error) {
      const keyError = extractErrorCode(error.message);
      if (!keyError) {
        if (defaultError) {
          toast.error(t(`errors.${defaultError}`, defaultErrorsParams), { autoClose: closeTimer || 3000 });
        }

        return;
      }

      toast.error(t(`messages.${keyError}`), { autoClose: closeTimer || 3000 });
    } else if (defaultError) {
      toast.error(t(`errors.${defaultError}`, defaultErrorsParams), { autoClose: closeTimer || 3000 });
    }
  }

  return { handleError };
}

function extractErrorCode(message: string): string | null {
  const regex = /Error Code: (\w+)/;
  const match = message.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}
