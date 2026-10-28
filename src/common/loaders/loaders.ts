import DataLoader from 'dataloader';
import type { OneToManySource } from './loaders.types.js';

const createOneToManyLoader = <K, V>(
  fetchRecords: (keys: readonly K[]) => Promise<V[]>,
  getParentId: (record: V) => K,
): DataLoader<K, V[]> => {
  return new DataLoader<K, V[]>(async (keys) => {
    const rows = await fetchRecords(keys);
    const grouped = new Map<K, V[]>();

    for (const row of rows) {
      const parentId = getParentId(row);
      const list = grouped.get(parentId) ?? [];

      list.push(row);
      grouped.set(parentId, list);
    }

    return keys.map((key) => grouped.get(key) ?? []);
  });
};

export class LoaderRegistry {
  private readonly oneToManyLoaders = new WeakMap<
    OneToManySource<any, any>,
    DataLoader<any, any[]>
  >();

  oneToMany<K, V>(source: OneToManySource<K, V>): DataLoader<K, V[]> {
    let loader = this.oneToManyLoaders.get(source);

    if (!loader) {
      loader = createOneToManyLoader<K, V>(
        (keys) => source.findByParentIds(keys),
        (record) => source.getParentId(record),
      );
      this.oneToManyLoaders.set(source, loader);
    }

    return loader as DataLoader<K, V[]>;
  }
}
