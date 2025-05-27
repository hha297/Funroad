import { parseAsBoolean, useQueryStates } from 'nuqs';

export const useCheckoutState = () => {
        return useQueryStates({
                success: parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
                cancel: parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
        });
};
