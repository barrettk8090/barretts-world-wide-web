const simpleOauthModule = require("simple-oauth2");

const oauth2 = simpleOauthModule.create({
  client: {
    id: process.env.GITHUB_CLIENT_ID,
    secret: process.env.GITHUB_CLIENT_SECRET,
  },
  auth: {
    tokenHost: "https://github.com",
    tokenPath: "/login/oauth/access_token",
    authorizePath: "/login/oauth/authorize",
  },
});

exports.handler = async (event) => {
  const code = event.queryStringParameters.code;
  
  try {
    const result = await oauth2.authorizationCode.getToken({
      code,
      redirect_uri: process.env.URL + "/admin/",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        token: result.access_token,
        provider: "github",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get token" }),
    };
  }
};