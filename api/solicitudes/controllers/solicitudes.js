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
        entities = await strapi.services.solicitudes.find("");

        // Filter entries by UID requested
        let entity;
        const key = ctx.params.id;
        entities = entities.filter(entity => entity["cuenta"]["UID"] == key);
        entity = entities[0];
        
         // parses the response to model
         const solicitudModel = sanitizeEntity(entity, {
            model: strapi.models.solicitudes,
         });
        
        // parses the response to model
        solicitudModel.solicitudes = solicitudModel.solicitudes.map(entity => {
            const solicitud = sanitizeEntity(entity, {
                model: strapi.models.cuentas,
            });

            delete solicitud.id;
            delete solicitud.matches;
            delete solicitud.solicitudes;
            delete solicitud.bloqueados;
            delete solicitud.test;
            delete solicitud.created_at;
            delete solicitud.updated_at;
           

            return solicitud;
        });
       

        return solicitudModel.solicitudes;
    },
};
