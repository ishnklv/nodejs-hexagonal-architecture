import { Connection, getRepository } from 'typeorm';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli';
import * as path from 'path';

/**
 * loadFixtures loads fixtures with dummy data in the database.
 * This is used for testing.
 * @param connection
 */
export const loadFixtures = async (connection: Connection): Promise<void> => {
  const fixturesPath = './test/fixtures';

  try {
    const loader = new Loader();
    loader.load(path.resolve(fixturesPath));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(connection, new Parser());

    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture);
      await getRepository(entity.constructor.name).save(entity);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};
