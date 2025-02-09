import { useReducer } from "react";

export interface IFormState<T> {
  fields: T;
  isSubmitting: boolean;
  error: string | null;
}

export function useFormState<T, A>(
  initialFields: T,
  reducer: (state: IFormState<T>, action: A) => IFormState<T>,
  onSubmit: (fields: T) => void
) {
  const initialState: IFormState<T> = {
    fields: initialFields,
    isSubmitting: false,
    error: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return { state, dispatch, submit: () => onSubmit(state.fields) };
}
