//only for supabase support
export const getPagination = (pageNo: number | 1, itemPerPage: number | 5) => {
  const from = itemPerPage * (pageNo - 1);
  const to = itemPerPage * pageNo - 1;
  return { from, to };
};
