export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  // 無効な日付の場合は空文字を返す
  if (isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ja-JP").format(date);
};
