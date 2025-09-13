export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ja-JP').format(date);
};