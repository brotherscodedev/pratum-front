"use client";


interface DataTableProps<TData, TValue> {
  //   columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  pageNo: number;
  totalUsers: number;
  //   pageSizeOptions?: number[];
  pageCount: number;
  //   searchParams?: {
  //     [key: string]: string | string[] | undefined;
  //   };
}

export function NotificacoesBusca<TData, TValue>({
  searchKey,
  pageCount,
  data,
}: DataTableProps<TData, TValue>) {
  //TODO recriar tela
  return null;
}
