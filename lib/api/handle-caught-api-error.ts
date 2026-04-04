export function handleCaughtApiError(_error: unknown) {
  // Mutation/query hooks already surface user-facing errors. Catching at the call
  // site prevents unhandled promise rejections when we await them in UI handlers.
}
