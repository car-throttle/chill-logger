var chill = require('../logger');
var log = chill();

log.info('started', 'Starting up the example script');

log.debug('Something old, something new, something borrowed, something new');

log.warn({ situation: 'yellow' });

log.error({ code: 'DANGER_DANGER', 'message': 'You should not have done that!!' });

log.error(new Error('Y U GON DUN THAT'));

log.info('alert', { wibbly: 'wobbly', timey: 'wimey' });
