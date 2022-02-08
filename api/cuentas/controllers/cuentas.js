'use strict';

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
        delete cuenta.matches;
        delete cuenta.solicitudes;
        delete cuenta.bloqueados;
        delete cuenta.test;
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
        

        //parses the faculty
        const facultad = sanitizeEntity(cuenta.facultad, {
            model: strapi.models.facultades,
        });

        delete facultad.created_at;
        delete facultad.updated_at;
        delete facultad.id;

        cuenta.facultad = facultad;

        //returns the new response
        return cuenta;
    },
};
