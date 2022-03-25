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
        entities = entities.filter(entity => entity["cuenta"] == key);
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
    add: async ctx => { 
        // Fetches all entries
        let entities
        entities = await strapi.services.solicitudes.find("");
        

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
        model: strapi.models.solicitudes,
     });

    
     const json = sanitizeEntity(ctx.request.body, {
        model: strapi.models.cuentas,
     });



     solicitudModel.solicitudes = [... solicitudModel.solicitudes, json  ]

    

       let request = {"cuenta": key, "solicitudes": solicitudModel.solicitudes};
       
       entity = await strapi.services.solicitudes.update({ id }, request);
       
       return entity;
       
   },
   editList: async ctx => { 
       
        if(JSON.stringify(ctx.request.body) == "{}"|| ctx.request.body === null){
            return ctx.badRequest('El cuerpo de la petición viene vacía');
        }
s
        // Fetches all entries
        let entities
        entities = await strapi.services.solicitudes.find("");

        const key = ctx.params.id;
        entities = entities.filter(entity => entity["cuenta"] == key);
       let entity = entities[0];
       let id = entity["id"];

       let request = {"cuenta": key, "solicitudes": ctx.request.body};

       entity = await strapi.services.solicitudes.update({ id }, request);
       

       return entity;
   }
};
