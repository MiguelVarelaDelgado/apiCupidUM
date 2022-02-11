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
        entities = entities.filter(entity => entity["cuenta"] == key);
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
    add: async ctx => { 
        // Fetches all entries
        let entities
        entities = await strapi.services.matches.find("");
       

        // Filter entries by UID requested
        let entity;
        const key = ctx.params.id;
        entities = entities.filter(entity => entity["cuenta"] == key);
       entity = entities[0];
       let id = entity["id"];

       if(ctx.request.body["id"] == null){
            return ctx.badRequest('El campo de id es nulo', { campo: 'id' });
       }

       const solicitudModel = sanitizeEntity(entity, {
        model: strapi.models.matches,
     });


     const json = sanitizeEntity(ctx.request.body, {
        model: strapi.models.cuentas,
     });



     solicitudModel.matches = [... solicitudModel.matches, json  ]

    

       let request = {"cuenta": key, "matches": solicitudModel.matches};
       
       entity = await strapi.services.matches.update({ id }, request);
       

       return entity;
   },
   editList: async ctx => { 
       
        if(JSON.stringify(ctx.request.body) == "{}"|| ctx.request.body === null){
            return ctx.badRequest('El cuerpo de la petición viene vacía');
        }
s
        // Fetches all entries
        let entities
        entities = await strapi.services.matches.find("");

        const key = ctx.params.id;
        entities = entities.filter(entity => entity["cuenta"] == key);
       let entity = entities[0];
       let id = entity["id"];

       let request = {"cuenta": key, "matches": ctx.request.body};

       entity = await strapi.services.matches.update({ id }, request);
       

       return entity;
   }
};
