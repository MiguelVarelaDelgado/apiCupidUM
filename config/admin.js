module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'f1ded2319feafb72e1d516dc21ec0ed6'),
  },
});
