import * as React from "react";

export function useDebouncedCallback<T extends (...args: never[]) => void>(
  fn: T,
  waitMs: number,
) {
  const fnRef = React.useRef(fn);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return React.useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fnRef.current(...args), waitMs);
    },
    [waitMs],
  );
}
