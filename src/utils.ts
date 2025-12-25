export const ok = <T>(value: T) => ({
    success: true as const,
    value,
});

export const err = <E>(error: E) => ({
    success: false as const,
    error,
});