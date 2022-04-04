'use strict';

const { errors } = require('strapi-plugin-upload');
const {sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

// const result = await strapi
        //     .query('Cuentas')
        //     .model.query(qb => {
        //         qb.where('UID', key);
        //     }).fetch()

module.exports = {
    findOne: async ctx => {
        // Fetches all entries
        let entities
        entities = await strapi.services.cuentas.find("");

        // Filter entries by UID requested
        let entity;
        const key = ctx.params.id;
        entities = entities.filter(entity => entity["UID"] == key);
        entity = entities[0];
        
         // parses the response to model
         const cuenta = sanitizeEntity(entity, {
            model: strapi.models.cuentas,
        });

        // deletes the unneeded data
        delete cuenta.created_by;
        delete cuenta.updated_by;
        delete cuenta.created_at;
        delete cuenta.updated_at;

        // parses the hobbies
        cuenta.hobbies = cuenta.hobbies.map(hobby => {
            const hob = sanitizeEntity(hobby, {
                model: strapi.models.hobbies,
            });

            delete hob.created_at;
            delete hob.updated_at;
           

            return hob;
        });


        // No utilizar o condicionar los campos nulos para errores del sistema
        
        if(entity["facultad"]!=null){
        //parses the faculty
        const facultad = sanitizeEntity(cuenta.facultad, {
            model: strapi.models.facultades,
        });

        delete facultad.created_at;
        delete facultad.updated_at;
        

        cuenta.facultad = facultad;
        }else{
            return ctx.badRequest('El campo de facultad es nula', { campo: 'facultad' });
        }
        //returns the new response
        return cuenta;
    },
    create: async ctx => { 
        let entity;
        let cuenta = sanitizeEntity(ctx.request.body, { model: strapi.models.cuentas });

        let matchesMap = { "cuenta": cuenta.UID, "matches": [] };  
        let requestMap = { "cuenta": cuenta.UID, "solicitudes": [] };
        let blocksMap = { "cuenta": cuenta.UID, "bloqueados": [] };
        let esperaMap = { "cuenta": cuenta.UID, "espera": [] };

        if(ctx.request.body["facultad"]!=null){
        entity = await strapi.services.cuentas.create(ctx.request.body);

        await strapi.services.matches.create(matchesMap); 
        await strapi.services.solicitudes.create(requestMap); 
        await strapi.services.bloqueados.create(blocksMap); 
        await strapi.services.espera.create(esperaMap); 
        
        return sanitizeEntity(entity, { model: strapi.models.cuentas });
        }else{
            return ctx.badRequest('El campo de facultad es nula', { campo: 'facultad' });
        }
    },

    exist: async ctx => {
        // Fetches all entries
        let entities
        entities = await strapi.services.cuentas.find("");

        // Filter entries by UID requested
        let entity;
        const key = ctx.params.id;
        entities = entities.filter(entity => entity["UID"] == key);
        entity = entities[0];
        
        if(entity!=null){
            return true;
        }else return false;


    },
    update: async ctx => {
        // Fetches all entries
        let entities
        entities = await strapi.services.cuentas.find("");

        // Filter entries by UID requested
        let entity;
        const key = ctx.params.id;
        entities = entities.filter(entity => entity["UID"] == key);
        entity = entities[0];

        const id = entity["id"];
        
        const response = await strapi.services.cuentas.update({ id }, ctx.request.body);

        return sanitizeEntity(response, { model: strapi.models.cuentas });
    },

    findMatches: async ctx => {
        // Agarrar el UID
        // Fetches all entries
        let entities
        entities = await strapi.services.cuentas.find("");

        // Filter entries by UID requested
        let entity;
        const key = ctx.params.id;
        entity = entities.filter(entity => entity["UID"] == key)[0];
         // parses the response to model
         const cuenta = sanitizeEntity(entity, {
            model: strapi.models.cuentas,
        });

        if(cuenta.objetivo=="Relacion"){
            let generoOb= cuenta.genero=="Masculino"?"Femenino":"Masculino";
            entities=entities.filter(entity => entity["objetivo"] == "Relacion" && entity["genero"] ==generoOb);
        }else{
            entities=entities.filter(entity => entity["UID"] != key && entity["objetivo"] != "Relacion");
        }

        let bloqueados=await strapi.services.bloqueados.find("");
        bloqueados=bloqueados.filter(entity => entity["cuenta"] == key)[0];
        
        


        let esperas=await strapi.services.espera.find("");
        esperas=esperas.filter(entity => entity["cuenta"] == key)[0];

        let matches=await strapi.services.matches.find("");
        matches=matches.filter(entity => entity["cuenta"] == key)[0];
        // parses the response to model
        const b = sanitizeEntity(bloqueados, {
            model: strapi.models.bloqueados,
        });
        // parses the response to model
        const e = sanitizeEntity(esperas, {
            model: strapi.models.espera,
        });
        // parses the response to model
        const m = sanitizeEntity(matches, {
            model: strapi.models.matches,
        });
        entities=entities.filter(entity => !b.bloqueados.find(e=>e["UID"]===entity["UID"]));
        entities=entities.filter(entity => !e.espera.find(e=>e["UID"]===entity["UID"]));
        entities=entities.filter(entity => !m.matches.find(e=>e["UID"]===entity["UID"]));

        return entities;
    },
};
