
exports.up = function(knex, Promise) {
    return knex.schema.createTable('projects', function(tbl) {
        tbl.increments();
        tbl.text('name', 128)
          .notNullable()
          .unique();
        tbl.text('description');
        tbl.boolean('completed')
            .defaultTo(false)
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('projects');
};
