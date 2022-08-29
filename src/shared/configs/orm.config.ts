import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as path from "path";
import { ConnectionOptions as TypeOrmSeedingConnectionOptions } from "typeorm-seeding/dist/connection";
import { Environment } from "@config/env.config";

/**
 * The config is used to configure the database connection in the AppModule.
 * https://stackoverflow.com/questions/63678216/nestjs-setup-typeorm-connection-with-env-and-nestjs-config
 */
export const ormConfig: TypeOrmModuleOptions | TypeOrmSeedingConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV !== Environment.Local && process.env.NODE_ENV !== Environment.E2e ? { rejectUnauthorized: false } : false,
  autoLoadEntities: true,
  // We are using migrations, synchronize should be set to false.
  synchronize: false,
  dropSchema: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: ["warn", "error", "migration", "schema"],
  entities: [path.join(__dirname, "..", "..", "**", "repository", "*.orm-entity.{js,ts}")],
  migrationsTableName: "migrations",
  migrations: [path.join(__dirname, "..", "..", "**", "migrations", "*.{js,ts}")],
  seeds: [path.join(__dirname, "..", "..", "**", "seeders", "**", "*.seeder.{js,ts}")],
  factories: [path.join(__dirname, "..", "..", "**", "factories", "**", "*.{js,ts}")],
  cli: {
    migrationsDir: path.join("src", "migrations")
  }
};

// Has to be exported as default for typeorm to detect the config.
// See https://github.com/typeorm/typeorm/issues/4068
// Other files should use the named export.
export default ormConfig;
