import { describe, it, expect, vi } from 'vitest';
import { OneToManySource } from './loaders.types.js';
import { LoaderRegistry } from './loaders.js';
import DataLoader from 'dataloader';

interface TestItem {
  id: number;
  parentId: number;
  name: string;
}

interface ParentItem {
  id: number;
}

const PARENT_A: ParentItem = { id: 5 };
const PARENT_B: ParentItem = { id: 6 };

const A_PARENTS_ITEMS: TestItem[] = [
  { id: 1, parentId: PARENT_A.id, name: 'Item A1' },
  { id: 3, parentId: PARENT_A.id, name: 'Item A2' },
];

const B_PARENTS_ITEMS: TestItem[] = [
  { id: 2, parentId: PARENT_B.id, name: 'Item B1' },
];

const createSource = (data: TestItem[]) => {
  const findByParentIds = vi.fn(async (parentIds: readonly number[]) => {
    return data.filter((row) => parentIds.includes(row.parentId));
  });

  const getParentId = vi.fn((item: TestItem) => item.parentId);

  const source: OneToManySource<number, TestItem> = {
    findByParentIds,
    getParentId,
  };

  return { source, findByParentIds, getParentId };
};

describe('LoaderRegistry.oneToMany', () => {
  let ctx: ReturnType<typeof createSource>;
  let loader: DataLoader<number, TestItem[]>;

  const items: TestItem[] = [...A_PARENTS_ITEMS, ...B_PARENTS_ITEMS];

  beforeEach(async () => {
    ctx = createSource(items);
    loader = new LoaderRegistry().oneToMany(ctx.source);
  });

  describe('with a single parent load', () => {
    it('should return only items of that parent', async () => {
      await expect(loader.load(PARENT_A.id)).resolves.toEqual(A_PARENTS_ITEMS);
    });

    it('should call findByParentIds once with that parent id', async () => {
      await loader.load(PARENT_A.id);

      expect(ctx.findByParentIds).toHaveBeenCalledOnce();
      expect(ctx.findByParentIds).toHaveBeenCalledWith([PARENT_A.id]);
    });
  });

  describe('with several parent loads in the same tick', () => {
    it('should batch them into a single findByParentIds call', async () => {
      await Promise.all([loader.load(PARENT_A.id), loader.load(PARENT_B.id)]);

      expect(ctx.findByParentIds).toHaveBeenCalledOnce();
      expect(ctx.findByParentIds).toHaveBeenCalledWith([
        PARENT_A.id,
        PARENT_B.id,
      ]);
    });

    it('should group items by parent', async () => {
      const [a, b] = await Promise.all([
        loader.load(PARENT_A.id),
        loader.load(PARENT_B.id),
      ]);

      expect(a).toEqual(A_PARENTS_ITEMS);
      expect(b).toEqual(B_PARENTS_ITEMS);
    });
  });

  describe('with dublicate parent id loads', () => {
    it('should deduplicate keys', async () => {
      await Promise.all([loader.load(PARENT_A.id), loader.load(PARENT_A.id)]);

      expect(ctx.findByParentIds).toHaveBeenCalledWith([PARENT_A.id]);
    });
  });

  describe('with a parent without items', () => {
    it('should return an empty array', async () => {
      await expect(loader.load(999)).resolves.toEqual([]);
    });
  });

  describe('without loads', () => {
    it('should not call findByParentIds', async () => {
      await Promise.resolve();

      expect(ctx.findByParentIds).not.toHaveBeenCalled();
    });
  });
});
