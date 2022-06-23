import ApolloClient from "apollo-boost";

export const createClient = (shop, accessToken) => {
  return new ApolloClient({
    uri: `https://${shop}/admin/api/2019-10/graphql.json`,
    request: (operation) => {
      operation.setContext({
        headers: {
          "X-FPP-Access-Token": accessToken,
          "User-Agent": `fpp-app-node ${process.env.npm_package_version} | Fpp App CLI`,
        },
      });
    },
  });
};
