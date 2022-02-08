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
        entities = await strapi.services.bloqueados.find("");
       

        // Filter entries by UID requested
        let entity;
        const key = ctx.params.id;
        entities = entities.filter(entity => entity["cuenta"]["UID"] == key);
        entity = entities[0];
        
        
         // parses the response to model
         let bloqueadosModel = sanitizeEntity(entity, {
            model: strapi.models.bloqueados,
         });
        
        
        
        // parses the response to model
        bloqueadosModel.bloqueados = bloqueadosModel.bloqueados.map(entity => {
            const blocked = sanitizeEntity(entity, {
                model: strapi.models.cuentas,
            });

            delete blocked.id;
            delete blocked.matches;
            delete blocked.solicitudes;
            delete blocked.bloqueados;
            delete blocked.test;
            delete blocked.created_at;
            delete blocked.updated_at;
           

            return blocked;
        });
       

        return bloqueadosModel.bloqueados;
    },
};
