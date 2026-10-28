export interface OneToManySource<K, V> {
  findByParentIds(parentIds: readonly K[]): Promise<V[]>;
  getParentId(record: V): K;
}
