import { CrudOptions } from '@nestjsx/crud';

/**
 * CrudConfig creates a config for the crud controller with some default values
 * set. The default values can be overridden if necessary.
 * @param options
 */
export function crudConfig(options: CrudOptions): CrudOptions {
    return {
        ...options,
        params: {
            ...options.params,
            id: {
                ...options.params?.id,
                field: 'id',
                type: 'uuid',
                primary: true,
            },
        },
        query: {
            ...options.query,
            maxLimit: 1000,
        },
    };
}
