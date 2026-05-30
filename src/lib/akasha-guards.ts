import type { AkashaSearchResponse } from "../../api-contract/akasha.schema";

type SerializableMetadataValue = string | number | boolean | null;
type SerializableMetadata = Record<string, SerializableMetadataValue>;

export type AkashaSearchResultSerializable = Omit<
  AkashaSearchResponse["results"][number],
  "metadata"
> & { metadata?: SerializableMetadata };

export interface SearchAkashaEnvelope {
  data: (Omit<AkashaSearchResponse, "results"> & {
    results: AkashaSearchResultSerializable[];
  }) | null;
  error: string | null;
}

export function isSearchAkashaEnvelope(value: unknown): value is SearchAkashaEnvelope {
  if (value == null || typeof value !== "object") return false;
  if (!("error" in value) || !("data" in value)) return false;
  const obj = value as { error: unknown; data: unknown };
  const errorOk = obj.error === null || typeof obj.error === "string";
  const dataOk =
    obj.data === null ||
    (typeof obj.data === "object" && obj.data !== null && "results" in obj.data);
  return errorOk && dataOk;
}
