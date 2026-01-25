import { getDb } from '../config/jest/helper'

interface TestDoc {
  name: string;
  age?: number;
}

it('update with promise', async () => {
  const db = await getDb<TestDoc>();
  const items0 = await db.findAsync({})

  await db.insertAsync({ name: 'Maggie' })
  await db.insertAsync({ name: 'Bob' })

  const items = await db.findAsync({})

  const maggie1 = await db.findOneAsync({ name: 'Maggie' })
  const bob1 = await db.findOneAsync({ name: 'Bob' })

  await db.updateAsync({ name: { $in: ['Maggie', 'Bob'] } }, { $set: { age: 1 } }, { multi: true })

  const maggie2 = await db.findOneAsync({ name: 'Maggie' })
  const bob2 = await db.findOneAsync({ name: 'Bob' })

  expect(items0).toHaveLength(0)
  expect(items).toHaveLength(2)
  expect(maggie1.age).toBeUndefined()
  expect(bob1.age).toBeUndefined()
  expect(bob2.age).toEqual(1)
  expect(maggie2.age).toEqual(1)
})

it('update with callback', async () => {
  const db = await getDb<TestDoc>();
  const items0 = await db.findAsync({})

  await db.insertAsync({ name: 'Maggie' })
  await db.insertAsync({ name: 'Bob' })

  const items = await db.findAsync({})

  const maggie1 = await db.findOneAsync({ name: 'Maggie' })
  const bob1 = await db.findOneAsync({ name: 'Bob' })

  const res = await new Promise<number>((resolve, reject) => {
    db.update(
      { name: { $in: ['Maggie', 'Bob'] } },
      { $set: { age: 1 } },
      { multi: true },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });

  const maggie2 = await db.findOneAsync({ name: 'Maggie' })
  const bob2 = await db.findOneAsync({ name: 'Bob' })

  expect(res).toEqual(2)
  expect(items0).toHaveLength(0)
  expect(items).toHaveLength(2)
  expect(maggie1.age).toBeUndefined()
  expect(bob1.age).toBeUndefined()
  expect(bob2.age).toEqual(1)
  expect(maggie2.age).toEqual(1)
})

it('remove with callback', async () => {
  const db = await getDb<TestDoc>();
  const items0 = await db.findAsync({})

  await db.insertAsync({ name: 'Maggie' })
  await db.insertAsync({ name: 'Bob' })

  const items = await db.findAsync({})

  const res = await new Promise<number>((resolve, reject) => {
    db.remove({ name: { $in: ['Bob'] } }, { multi: true }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  const bob2 = await db.findOneAsync({ name: 'Bob' })

  expect(res).toEqual(1)
  expect(items0).toHaveLength(0)
  expect(items).toHaveLength(2)
  expect(bob2).toBeNull()
})

it('resolve remove nonexistent', async () => {
  const db = await getDb<TestDoc>();
  const items0 = await db.findAsync({})

  await db.insertAsync({ name: 'Maggie' })
  await db.insertAsync({ name: 'Bob' })

  const items = await db.findAsync({})

  const res = await new Promise<number>((resolve, reject) => {
    db.remove({ name: 'nonexistent' }, { multi: true }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  const nonexistent = await db.findOneAsync({ name: 'nonexistent' })

  expect(res).toEqual(0)
  expect(items0).toHaveLength(0)
  expect(items).toHaveLength(2)
  expect(nonexistent).toBeNull()
})

it('resolve findOne nonexistent', async () => {
  const db = await getDb<TestDoc>();
  await db.insertAsync({ name: 'Maggie' })
  await db.insertAsync({ name: 'Bob' })

  const items = await db.findAsync({ name: 'nonexistent' })

  const item = await db.findOneAsync({ name: 'nonexistent' });

  expect(item).toBeNull()
  expect(items.length).toEqual(0)
})

it('should limit', async () => {
  const db = await getDb<TestDoc>();
  await db.insertAsync({ name: 'A' })
  await db.insertAsync({ name: 'B' })
  await db.insertAsync({ name: 'C' })
  await db.insertAsync({ name: 'D' })

  const docs = await new Promise<TestDoc[]>((resolve, reject) => {
    db.find({})
      .sort({ name: 1 })
      .skip(1)
      .limit(2)
      .exec((err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
  });

  expect(docs.length).toEqual(2)
  expect(docs[1].name).toEqual('C')
})

it('should limit async', async () => {
  const db = await getDb<TestDoc>();
  await db.insertAsync({ name: 'A' })
  await db.insertAsync({ name: 'B' })
  await db.insertAsync({ name: 'C' })
  await db.insertAsync({ name: 'D' })

  const docs = await db.find({}).sort({ name: 1 }).skip(1).limit(2).exec()

  expect(docs.length).toEqual(2)
  expect(docs[1].name).toEqual('C')
})
