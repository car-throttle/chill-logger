var logger = require('./logger')();

logger.info('started', 'Starting up the example script');

logger.debug('Something old, something new, something borrowed, something new');

logger.warn({ situation: 'yellow' });

logger.error({ code: 'DANGER_DANGER', 'message': 'You should not have done that!!' });

logger.error(new Error('Y U GON DUN THAT'));

logger.info('alert', { wibbly: 'wobbly', timey: 'wimey' });
