'use strict';

const {sanitizeEntity } = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    findOne: async ctx => {
        // Fetches all entries
        let entities
        entities = await strapi.services.matches.find("");

        // Filter entries by UID requested
        let entity;
        const key = ctx.params.id;
        entities = entities.filter(entity => entity["cuenta"]["UID"] == key);
        entity = entities[0];
        
        
         // parses the response to model
         let matchesModel = sanitizeEntity(entity, {
            model: strapi.models.matches,
         });
        
        
        
        // parses the response to model
        matchesModel.matches = matchesModel.matches.map(entity => {
            const match = sanitizeEntity(entity, {
                model: strapi.models.cuentas,
            });

            delete match.id;
            delete match.matches;
            delete match.solicitudes;
            delete match.bloqueados;
            delete match.test;
            delete match.created_at;
            delete match.updated_at;
           

            return match;
        });
       

        return matchesModel.matches;
    },
};
