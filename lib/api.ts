import { gql, useQuery } from "@apollo/client";

export const GET_HOMEPAGE = gql`
  query GET_HOMEPAGE {
    post(id: "home", idType: SLUG) {
      homepageFields {
        fieldGroupName
        header
        subtitle
        featuresDescription
        featureHeader
      }
      seo {
        fullHead
        title
      }
    }
  }
`;

export async function getHomepage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SLYDYN_WORDPRESS_GRAPHQL}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: ` query GET_HOMEPAGE {
            post(id: "home", idType: SLUG) {
              homepageFields {
                fieldGroupName
                header
                subtitle
                featuresDescription
                featureHeader
              }
              seo {
                fullHead
                title
              }
            }
          }`,
      }),
    }
  );
  const json = await res.json();
  console.log(json.data.post);
  return json.data.post;
}
