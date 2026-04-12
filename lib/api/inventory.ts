import type { PantryBatch, PantryItem, PantryStatusFilter } from "@/components/dashboard/kitchen/types";
import type { FillLevel, ItemType, TrackingMode } from "@/lib/inventory/types";
import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export type InventoryItemBatchResponse = {
  best_before?: string;
  created_at: string;
  fill_level?: string;
  key: string;
  quantity?: number;
  updated_at: string;
};

export type InventoryItemResponse = {
  batches?: InventoryItemBatchResponse[] | null;
  created_at: string;
  item_type?: ItemType;
  key: string;
  name: string;
  storage_location?: {
    created_at: string;
    key: string;
    name: string;
    updated_at: string;
  } | null;
  tracking_mode?: TrackingMode;
  updated_at: string;
};

export type InventoryListPagination = {
  page?: number;
  page_count?: number;
  per_page?: number;
  skipped?: number;
  total?: number;
  total_volume?: number;
};

type InventoryListResponse =
  | InventoryItemResponse[]
  | {
      items?: InventoryItemResponse[] | null;
      pagination?: InventoryListPagination | null;
    };

export type InventoryListParams = {
  search?: string;
  status?: PantryStatusFilter;
  storageLocationKey?: string;
};

export const INVENTORY_QUERY_KEY = ["inventory-items"] as const;
export const INVENTORY_PAGE_SIZE = 20;

export type InventoryItemsPage = {
  hasMore: boolean;
  items: PantryItem[];
  page: number;
};

function mapStatusFilter(status?: PantryStatusFilter) {
  switch (status) {
    case "expiring":
      return "expiring_soon";
    case "low":
      return "running_low";
    case "finished":
      return "finished";
    case undefined:
    default:
      return undefined;
  }
}

function isFillLevel(value: string | undefined): value is FillLevel {
  return (
    value === "sealed" ||
    value === "just_opened" ||
    value === "half" ||
    value === "almost_empty"
  );
}

function mapInventoryBatch(
  batch: InventoryItemBatchResponse,
  index: number,
  status?: PantryStatusFilter,
): PantryBatch {
  return {
    id: index + 1,
    qty: typeof batch.quantity === "number" && Number.isFinite(batch.quantity) ? batch.quantity : 1,
    fillLevel: isFillLevel(batch.fill_level) ? batch.fill_level : "sealed",
    sealed: batch.fill_level === "sealed",
    bestBefore: batch.best_before ?? "",
    finished: status === "finished",
  };
}

export function mapInventoryItemResponseToPantryItem(
  item: InventoryItemResponse,
  status?: PantryStatusFilter,
): PantryItem {
  return {
    id: item.key,
    name: item.name,
    type: item.item_type ?? "ingredient",
    location: item.storage_location?.name ?? "",
    storageLocationKey: item.storage_location?.key,
    countAsUnits: item.tracking_mode === "quantity",
    batches: (item.batches ?? []).map((batch, index) => mapInventoryBatch(batch, index, status)),
  };
}

function getRawInventoryItems(data: InventoryListResponse | null | undefined) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  return [];
}

function getInventoryPagination(data: InventoryListResponse | null | undefined) {
  return Array.isArray(data) ? undefined : data?.pagination ?? undefined;
}

export async function getInventoryItemsPage(
  params: InventoryListParams = {},
  page = 1,
  perPage = INVENTORY_PAGE_SIZE,
) {
  const requestParams = {
    ...(params.search?.trim() ? { search: params.search.trim() } : {}),
    ...(mapStatusFilter(params.status) ? { status: mapStatusFilter(params.status) } : {}),
    ...(params.storageLocationKey ? { storage_location_key: params.storageLocationKey } : {}),
    page,
    per_page: perPage,
  };

  console.log("Inventory request params", requestParams);

  const response = await apiClient.get<ApiResponse<InventoryListResponse>>("/api/v1/items", {
    params: requestParams,
  });
  console.log("Inventory response payload", response.data.data);

  const rawItems = getRawInventoryItems(response.data.data);
  const pagination = getInventoryPagination(response.data.data);
  const pageCount = pagination?.page_count;
  const currentPage = pagination?.page ?? page;
  const total = pagination?.total;
  const perPageFromResponse = pagination?.per_page;
  const hasUsablePagination =
    (typeof pageCount === "number" && pageCount > 0) ||
    (typeof total === "number" && total > 0) ||
    (typeof perPageFromResponse === "number" && perPageFromResponse > 0);

  return {
    hasMore:
      hasUsablePagination && typeof pageCount === "number" && pageCount > 0
        ? currentPage < pageCount
        : rawItems.length === perPage,
    items: rawItems.map((item) => mapInventoryItemResponseToPantryItem(item, params.status)),
    page: currentPage,
  } satisfies InventoryItemsPage;
}

export function useInfiniteInventoryItems(params: InventoryListParams = {}) {
  return useInfiniteQuery({
    queryKey: [
      ...INVENTORY_QUERY_KEY,
      params.search ?? "",
      params.status ?? "all",
      params.storageLocationKey ?? "",
    ],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getInventoryItemsPage(params, pageParam, INVENTORY_PAGE_SIZE),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    staleTime: 30_000,
  });
}
