export function useFormErrorTransformer() {
  function transformArrayErrors(
    errors: Record<string, string>,
    arrayFieldName: string = "events"
  ): Record<string, string> {
    const transformed: Record<string, string> = {};

    for (const [key, message] of Object.entries(errors)) {
      const match = key.match(/^(\d+)\.errors\.(\w+)$/);

      if (match) {
        const index = match[1];
        const field = match[2];
        transformed[`${arrayFieldName}[${index}].${field}`] = message;
      } else {
        transformed[key] = message;
      }
    }
    return transformed;
  }

  function watchAndSetErrors(
    errorsRef: () => Record<string, string>,
    setErrors: (errors: Record<string, string>) => void,
    arrayFieldName: string = "events"
  ) {
    watch(
      errorsRef,
      (newErrors) => {
        if (newErrors && Object.keys(newErrors).length > 0) {
          const transformed = transformArrayErrors(newErrors, arrayFieldName);
          setErrors(transformed);
        }
      },
      { deep: true }
    );
  }

  return {
    transformArrayErrors,
    watchAndSetErrors
  };
}
