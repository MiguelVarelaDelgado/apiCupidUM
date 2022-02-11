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
        entities = entities.filter(entity => entity["cuenta"] == key);
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
    add: async ctx => { 
        // Fetches all entries
        let entities
        entities = await strapi.services.bloqueados.find("");
       

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
        model: strapi.models.bloqueados,
     });


     const json = sanitizeEntity(ctx.request.body, {
        model: strapi.models.cuentas,
     });



     solicitudModel.bloqueados = [... solicitudModel.bloqueados, json  ]

    

       let request = {"cuenta": key, "bloqueados": solicitudModel.bloqueados};
       
       entity = await strapi.services.bloqueados.update({ id }, request);
       

       return entity;
   },
   editList: async ctx => { 
       
        if(JSON.stringify(ctx.request.body) == "{}"|| ctx.request.body === null){
            return ctx.badRequest('El cuerpo de la petición viene vacía');
        }
s
        // Fetches all entries
        let entities
        entities = await strapi.services.bloqueados.find("");

        const key = ctx.params.id;
        entities = entities.filter(entity => entity["cuenta"] == key);
       let entity = entities[0];
       let id = entity["id"];

       let request = {"cuenta": key, "bloqueados": ctx.request.body};

       entity = await strapi.services.bloqueados.update({ id }, request);
       

       return entity;
   },
};
