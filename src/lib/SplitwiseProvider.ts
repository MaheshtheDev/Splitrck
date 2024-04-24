import {
  OAuthConfig,
  OAuthUserConfig,
  Provider,
} from "next-auth/providers/index";

const SPLITWISE_API_URL = "https://secure.splitwise.com";

export default function SplitwiseProvider<p extends Record<string, any>>(
  options: OAuthUserConfig<p>
): OAuthConfig<p> {
  return {
    id: "splitwise",
    name: "Splitwise",
    type: "oauth",
    //version: "2.0",
    authorization: {
      url: `${SPLITWISE_API_URL}/oauth/authorize`,
      params: { scope: "", client_id: options.clientId },
    },
    token: {
      url: `${SPLITWISE_API_URL}/oauth/token`,
      params: {
        grant_type: "authorization_code",
        client_id: options.clientId,
        client_secret: options.clientSecret,
      },
    },
    clientId: process.env.SPLITWISE_CLIENT_ID,
    clientSecret: process.env.SPLITWISE_CLIENT_SECRET,
    userinfo: {
      url: `${SPLITWISE_API_URL}/api/v3.0/get_current_user`,
      async request(context: any) {
        const profile = await fetch(
          `${SPLITWISE_API_URL}/api/v3.0/get_current_user`,
          {
            headers: {
              Authorization: `Bearer ${context.tokens.access_token}`,
            },
          }
        );

        const { user } = await profile.json();

        return {
          id: user.id,
          name: user.first_name + " " + user.last_name,
          email: user.email,
        };
      },
    },
    async profile(profile: any) {
      return {
        id: profile.id,
      };
    },
    checks: ["state"],
  };
}
